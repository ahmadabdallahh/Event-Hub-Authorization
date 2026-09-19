import { Form, Link } from 'react-router-dom';

interface EventItemProps {
    event: {
        id: string | number;
        image: string;
        title: string;
        date: string;
        description: string;
    };
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

function EventItem({ event }: EventItemProps) {
    return (
        <article className="mx-auto mt-6 w-full max-w-3xl animate-fade-up overflow-hidden rounded-2xl bg-gray-800 shadow-xl shadow-black/20">
            <div className="relative aspect-16/8 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-800 via-transparent to-transparent" />
                <time className="absolute left-5 top-5 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-primary-300 tabular-nums backdrop-blur">
                    {formatDate(event.date)}
                </time>
            </div>
            <div className="px-6 py-6 text-center sm:px-10 sm:py-8">
                <h1 className="font-display text-balance text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    {event.title}
                </h1>
                <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-300">
                    {event.description}
                </p>

                <menu className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        to="edit"
                        className="rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                    >
                        Edit
                    </Link>

                    <Form method="post">
                        <button
                            type="submit"
                            className="cursor-pointer rounded-md px-6 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-gray-100 active:scale-[0.98]"
                        >
                            Delete
                        </button>
                    </Form>
                </menu>
            </div>
        </article>
    );
}

export default EventItem;
