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
            const focused = isTextField(document.activeElement);

            // Tant qu'aucun champ n'est focalisé, la hauteur courante EST la
            // référence : sinon le repli de la barre d'URL pendant le scroll
            // serait pris pour l'ouverture du clavier.
            if (!focused || height > baseline) baseline = height;

            // N'écrire que si la valeur change : ce handler tourne pendant le
            // scroll, et toucher <html> invalide le style de tout l'arbre.
            const appH = `${Math.round(height)}px`;
            if (root.style.getPropertyValue("--app-h") !== appH) {
                root.style.setProperty("--app-h", appH);
            }

            // Le clavier ne peut être ouvert que si un champ texte est focalisé.
            // On l'admet alors sur écran tactile, ou si le viewport a nettement
            // rétréci (la barre d'URL ne fait qu'une soixantaine de pixels).
            const shrunk = baseline - height > 120;
            const onTouch = window.matchMedia("(pointer: coarse)").matches;
            const kb = focused && (onTouch || shrunk) ? "open" : "closed";
            if (root.dataset.kb !== kb) root.dataset.kb = kb;

            // Safari décale la page vers le haut pour révéler le champ focalisé.
            // On ne rattrape ce décalage que sur un écran verrouillé en hauteur
            // (la partie : `.app-shell` en h-[var(--app-h)] overflow-hidden),
            // où aucun scroll de page n'est légitime. Ailleurs — création de
            // partie, fin de partie, profil… — la page défile normalement et
            // forcer scrollTo(0,0) renverrait l'utilisateur en haut dès qu'il
            // descend, le repli de la barre d'URL déclenchant ce handler.
            if (window.scrollY !== 0 && root.scrollHeight <= baseline + 1) {
                window.scrollTo(0, 0);
            }
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
