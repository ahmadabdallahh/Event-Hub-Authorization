export async function eventsLoader() {
    const BASE_URL = import.meta.env.API_URL ?? 'http://localhost:8080/events/';

    const response = await fetch(BASE_URL);

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
