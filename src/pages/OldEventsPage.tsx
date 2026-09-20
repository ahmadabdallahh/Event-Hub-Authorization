import { useEffect, useState } from "react";
import { EVENTS_API_URL } from "../utils/api";

type EventType = {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
}

const EventsPage = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL = EVENTS_API_URL;

    useEffect(() => {
        setIsLoading(true);
        fetch(BASE_URL)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data?.events ?? []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-[#1c1917] border border-stone-800/60 rounded-2xl shadow-2xl backdrop-blur-xl text-stone-100 max-w-sm mx-auto my-6">
                {/* Animated Spinner */}
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />

                <p className="text-sm font-semibold text-stone-300 tracking-wide animate-pulse">
                    Loading, please wait...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-4xl flex flex-col gap-4 p-4">
                {events.map((event) => (
                    <div key={event.id} className="flex bg-[#31302e] rounded overflow-hidden text-white">
                        {event.image && (
                            <img src={event.image} alt={event.title} className="w-1/3 object-cover" />
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                            <p className="text-sm text-[#aeaba7] mb-2">{event.date}</p>
                            <p>{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default EventsPage
