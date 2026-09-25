// INFO: This is a simplified version of the editEventDetails function

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { EVENTS_API_URL } from "../api";

const BASE_URL = EVENTS_API_URL;

export async function editEventDetails({ request, params }: ActionFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Response("Event ID is required", { status: 400 });
    }

    const formData = await request.formData();
    const updatedData = Object.fromEntries(formData);

    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
        let message = 'Failed to update event';
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

    return redirect(`/events/${id}`);
}
