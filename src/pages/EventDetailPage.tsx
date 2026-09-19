import { Link, useLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import type { EventType } from "../utils/fetchOneEvent";

const EventDetailPage = () => {
    const event = useLoaderData() as EventType;

    return (
        <div className="mx-auto w-full max-w-4xl py-8">
            <Link
                to=".."
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 transition hover:text-primary-300"
            >
                <span aria-hidden="true">←</span>
                Back to all events
            </Link>

            <EventItem event={event} />
        </div>
    );
}

export default EventDetailPage
