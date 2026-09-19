import { Link } from 'react-router-dom';

type EventsListProps = {
    events: {
        id: string;
        image: string;
        title: string;
        date: string;
        description?: string;
    }[];
}

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatDate(iso: string) {
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    const [year, month, day] = parts;
    const label = MONTHS[Number(month) - 1] ?? month;
    return `${Number(day)} ${label} ${year}`;
}

function EventsList({ events }: EventsListProps) {
    if (events?.length === 0) {
        return (
            <div className="mx-auto my-12 w-full max-w-2xl rounded-2xl border border-dashed border-gray-700 bg-gray-800/50 px-8 py-16 text-center">
                <p className="font-display text-2xl font-semibold text-gray-100">
                    No events yet
                </p>
                <p className="mx-auto mt-2 max-w-sm text-gray-400">
                    There is nothing on the calendar right now. Be the first to
                    add an event and get things started.
                </p>

                <Link
                    to="new"
                    className="mt-6 inline-block rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                >
                    Create an event
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto my-8 w-full max-w-6xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-400">
                        Browse
                    </p>

                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                        All Events
                    </h1>
                </div>

                <p className="text-sm text-gray-500 tabular-nums">
                    {events?.length} upcoming
                </p>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => {
                    const featured = index === 0;
                    return (
                        <li
                            key={event.id}
                            className={featured ? 'sm:col-span-2 lg:col-span-2' : ''}
                        >
                            <Link
                                to={event.id}
                                style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                                className="group flex h-full animate-fade-up flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                            >

                                <div
                                    className={`relative overflow-hidden ${featured ? 'aspect-16/8' : 'aspect-video'
                                        }`}
                                >
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        width={600}
                                        height={400}
                                        loading={featured ? 'eager' : 'lazy'}
                                        fetchPriority={featured ? 'high' : undefined}
                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/70 via-transparent to-transparent" />

                                    <time className="absolute left-4 top-4 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-primary-300 tabular-nums backdrop-blur">
                                        {formatDate(event.date)}
                                    </time>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h2
                                        className={`font-display font-semibold text-gray-100 transition group-hover:text-primary-300 ${featured ? 'text-2xl' : 'text-lg'
                                            }`}
                                    >
                                        {event.title}
                                    </h2>

                                    {event.description && (
                                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-400">
                                            {event.description}
                                        </p>
                                    )}

                                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-400">
                                        View details
                                        <span
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        >
                                            →
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default EventsList;
