export function getApiUrl(): string {
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:3333`;
    }
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
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
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:3333`;
    }
    return "http://localhost:3333";
}