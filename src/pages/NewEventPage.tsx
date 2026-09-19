import EventForm from "../components/EventForm"

const NewEventPage = () => {

    return (
        <>
            <EventForm action="/events/new" method="post" />
        </>
    )
}

export default NewEventPage
