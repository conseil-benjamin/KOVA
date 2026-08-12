"use client";

import { useEffect } from "react";

/**
 * Adapte l'application à l'ouverture du clavier virtuel.
 *
 * PROBLÈME : sur mobile, l'ouverture du clavier ne réduit pas le layout
 * viewport. Le navigateur se contente de faire défiler la page pour révéler
 * le champ de saisie — l'en-tête et la question sortent alors par le haut.
 *
 * Ce composant ne fait que MESURER et exposer deux informations au CSS :
 *
 *   --app-h        hauteur réellement visible (hors clavier)
 *   data-kb        "open" | "closed" sur <html>
 *
 * Toutes les décisions visuelles restent dans le CSS / les composants
 * (variante Tailwind `kb:` définie dans globals.css). Aucune logique de jeu
 * n'est touchée ici.
 */
export default function ViewportHeightSync() {
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const root = document.documentElement;

        // Plus grande hauteur observée = état « sans clavier ».
        let baseline = vv.height;

        const isTextField = (el: Element | null) => {
            if (!el) return false;
            const tag = el.tagName;
            if (tag === "TEXTAREA") return true;
            if (tag !== "INPUT") return false;
            const type = (el as HTMLInputElement).type;
            return !["range", "checkbox", "radio", "submit", "button", "file"].includes(type);
        };

        const sync = () => {
            const height = vv.height;
            if (height > baseline) baseline = height;

            root.style.setProperty("--app-h", `${Math.round(height)}px`);

            // Le clavier est considéré ouvert si le viewport a nettement rétréci
            // (la barre d'URL qui se replie ne fait qu'une soixantaine de pixels),
            // ou si un champ texte est focalisé sur un écran tactile.
            const shrunk = baseline - height > 120;
            const typingOnTouch =
                isTextField(document.activeElement) &&
                window.matchMedia("(pointer: coarse)").matches;

            root.dataset.kb = shrunk || typingOnTouch ? "open" : "closed";

            // Safari décale la page vers le haut pour révéler le champ focalisé.
            // L'app étant déjà redimensionnée, ce décalage n'a plus lieu d'être.
            if (window.scrollY !== 0) window.scrollTo(0, 0);
        };

        sync();

        vv.addEventListener("resize", sync);
        vv.addEventListener("scroll", sync);
        // visualViewport ne couvre pas tous les cas (rotation, focus immédiat).
        window.addEventListener("resize", sync);
        window.addEventListener("orientationchange", sync);
        document.addEventListener("focusin", sync);
        document.addEventListener("focusout", sync);

        return () => {
            vv.removeEventListener("resize", sync);
            vv.removeEventListener("scroll", sync);
            window.removeEventListener("resize", sync);
            window.removeEventListener("orientationchange", sync);
            document.removeEventListener("focusin", sync);
            document.removeEventListener("focusout", sync);
            root.style.removeProperty("--app-h");
            delete root.dataset.kb;
        };
    }, []);

    return null;
}
