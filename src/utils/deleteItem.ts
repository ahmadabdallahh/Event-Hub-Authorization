// INFO: This is a simplified version of the fetchOneEvent function

import { redirect, type LoaderFunctionArgs } from "react-router-dom";

const BASE_URL = import.meta.env.API_URL ?? 'http://localhost:8080/events/';

export async function deleteItemAction({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Response("Event ID is required", { status: 400 });
    }

    const response = await fetch(`${BASE_URL}${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });

    if (!response.ok) {
        let message = 'Failed to delete event';
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

    return redirect("/events");
}
