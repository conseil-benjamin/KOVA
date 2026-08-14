export function getApiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
}

/**
 * Compare deux pseudos. Ils circulent avec des casses et des espaces variables
 * (cookie, socket, API) : un `find` sur un pseudo doit passer par ici, sinon le
 * joueur courant devient introuvable et son état (jokers, encre…) reste vide.
 */
export function sameUser(a?: string, b?: string): boolean {
    return !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Retour arrière sûr : l'historique peut être vide (lien direct, nouvel onglet,
 * app installée), auquel cas `history.back()` ne mène nulle part.
 */
export function goBack(router: { push: (href: string) => void }): void {
    if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
    } else {
        router.push('/');
    }
}

export function getWsUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
}
