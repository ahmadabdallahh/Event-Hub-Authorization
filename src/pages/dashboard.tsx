import { CalendarDays, Clock, LayoutGrid, Mail, Plus } from 'lucide-react';
import { Link, redirect, useLoaderData } from 'react-router-dom';
import { AUTH_API_URL, EVENTS_API_URL, apiFetch } from '../utils/api';
import type { EventType } from '../utils/events functions/fetchOneEvent';

export type DashboardData = {
    email: string;
    total: number;
    upcoming: number;
    past: number;
    latest: EventType | null;
};

/** Protected loader: bounces to /login when the cookie session is gone. */
export async function dashboardLoader(): Promise<DashboardData> {
    const meResponse = await apiFetch(`${AUTH_API_URL}/me`);
    if (!meResponse.ok) {
        throw redirect('/login');
    }

    const { email } = (await meResponse.json()) as { email: string };

    const eventsResponse = await apiFetch(EVENTS_API_URL);
    if (!eventsResponse.ok) {
        throw new Response('Failed to load dashboard data.', { status: eventsResponse.status });
    }
    const { events } = (await eventsResponse.json()) as { events: EventType[] };

    const today = new Date().toISOString().slice(0, 10);
    const upcomingCount = events.filter((event) => event.date >= today).length;
    const latest = [...events].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;

    return {
        email,
        total: events.length,
        upcoming: upcomingCount,
        past: events.length - upcomingCount,
        latest,
    };
}

const statCardClass =
    'rounded-xl bg-gray-800 p-5 shadow-xl shadow-black/20 transition hover:bg-gray-800/80';

const DashboardPage = () => {
    const { email, total, upcoming, past, latest } = useLoaderData() as DashboardData;

    const stats = [
        { icon: LayoutGrid, label: 'Total events', value: total },
        { icon: CalendarDays, label: 'Upcoming', value: upcoming },
        { icon: Clock, label: 'Past', value: past },
    ];

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-12">
            <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    Dashboard
                </p>
                <h1 className="font-display text-3xl font-bold tracking-tight text-gray-100">
                    Welcome back
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <Mail aria-hidden="true" className="h-4 w-4 text-gray-500" />
                    Signed in as <span className="font-medium text-gray-200">{email}</span>
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className={statCardClass}>
                        <Icon aria-hidden="true" className="mb-3 h-5 w-5 text-primary-400" />
                        <p className="font-display text-3xl font-bold text-gray-100">{value}</p>
                        <p className="mt-1 text-sm text-gray-400">{label}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl bg-gray-800 p-5 shadow-xl shadow-black/20 sm:p-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Latest event</h2>
                {latest ? (
                    <Link to={`/events/${latest.id}`} className="group block">
                        <p className="font-medium text-primary-400 transition group-hover:text-primary-300">
                            {latest.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">{latest.date}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-300">
                            {latest.description}
                        </p>
                    </Link>
                ) : (
                    <p className="text-sm text-gray-400">
                        No events yet.{' '}
                        <Link to="/events/new" className="font-medium text-primary-400 hover:text-primary-300">
                            Create the first one
                        </Link>
                        .
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                <Link
                    to="/events/new"
                    className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add event
                </Link>
                <Link
                    to="/events"
                    className="inline-flex items-center rounded-md border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-primary-300"
                >
                    View all events
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;
