import { useLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm"
import type { EventType } from "../utils/fetchOneEvent";

const EditEventPage = () => {
    const event = useLoaderData() as EventType;

    return (
        <>
            <EventForm event={event} method="patch" />
        </>
    )
}

export default EditEventPage
