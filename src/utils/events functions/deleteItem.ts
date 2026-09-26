// INFO: This is a simplified version of the fetchOneEvent function

import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { EVENTS_API_URL, apiFetch } from "../api";

const BASE_URL = EVENTS_API_URL;

export async function deleteItemAction({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Response("Event ID is required", { status: 400 });
    }

    // Cookie auth: apiFetch sends the httpOnly cookie and auto-logs-out on 401.
    const response = await apiFetch(`${BASE_URL}${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

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
// 30702251803632
