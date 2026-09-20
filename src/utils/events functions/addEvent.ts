// INFO: Add New EventType

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { EVENTS_API_URL } from "../api";

const BASE_URL = EVENTS_API_URL;

export async function addEvent({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as string;

    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, image }),
    });

    if (!response.ok) {
        let message = 'Failed to add event';
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
