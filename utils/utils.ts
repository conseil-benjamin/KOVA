export function getApiUrl(): string {
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:3333`;
    }
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
}

export function getWsUrl(): string {
    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:3333`;
    }
    return "http://localhost:3333";
}