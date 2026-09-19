// INFO: This is a simplified version of the fetchOneEvent function

import type { LoaderFunctionArgs } from "react-router-dom";

export type EventType = {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
};

const BASE_URL = import.meta.env.API_URL ?? 'http://localhost:8080/events/';

export async function fetchOneEvent({ params }: LoaderFunctionArgs): Promise<EventType> {
    const { id } = params;

    if (!id) {
        throw new Response("Event ID is required", { status: 400 });
    }

    const response = await fetch(`${BASE_URL}${id}`);

    if (!response.ok) {
        let message = 'Failed to fetch event';
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

    return data.event;
}
