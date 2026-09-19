import { useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

type EventType = {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
}

const EventsPageLoader = () => {
    const events = useLoaderData() as EventType[];

    return <EventsList events={events} />;
}

export default EventsPageLoader
