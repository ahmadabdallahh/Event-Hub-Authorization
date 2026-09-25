// INFO: Get Auth Token

export function getAuthToken() {
    const token = localStorage.getItem("token");
    return token ?? null;
}
