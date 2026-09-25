import { EVENTS_API_URL, apiFetch } from "../api";

export async function eventsLoader() {
    const response = await apiFetch(EVENTS_API_URL);

    if (!response.ok) {
        let message = 'Failed to fetch events';
        try {
            const errorData = await response.json();
            if (typeof errorData?.message === 'string' && errorData.message) {
                message = errorData.message;
            }
        } catch {
            // Keep the fallback message when the body is not JSON.
        }
        throw new Response(message, { status: response.status });
    }

    const data = await response.json();
    return data.events;
}
