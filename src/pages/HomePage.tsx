import { Link } from 'react-router-dom';

const steps = [
    {
        title: 'Browse Events',
        description: 'A loader fetches the latest events from the Express API on page load.',
        tag: 'GET /api/v1/events',
    },
    {
        title: 'View Details',
        description: 'Click any event and a route loader pulls that single record by id.',
        tag: 'GET /api/v1/events/:id',
    },
    {
        title: 'Create & Edit',
        description: 'Form submissions run a route action that POSTs or PATCHes back to the API.',
        tag: 'POST / PATCH',
    },
];

const layers = [
    {
        title: 'React Router Client',
        description: 'Routes, loaders and actions orchestrate what renders for each URL.',
        items: ['RootLayout · NavLink', 'eventsLoader · fetchOneEvent', 'addEvent · deleteItemAction', 'React.lazy code-splitting'],
    },
    {
        title: 'API Boundary',
        description: 'All data goes through a single fetch layer pointed at the deployed backend.',
        items: ['VITE_API_URL → http://localhost:8080/api/v1'],
    },
    {
        title: 'Express Server',
        description: 'A minimal REST API reading and writing the event store.',
        items: ['GET / POST / PATCH / DELETE', 'Express Router · Express JSON body parser'],
    },
    {
        title: 'Data Store',
        description: 'Events live in a JSON file the API reads and mutates.',
        items: ['backend/events.json — 16 events'],
    },
];

const stack = ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'React Router', 'Express', 'Fly.io', 'Vercel'];

const HomePage = () => {
    return (
        <div className="mx-auto max-w-4xl py-12">
            <section className="mb-16 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    React + React Router Practice
                </p>

                <h2 className="font-display mb-4 text-balance text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
                    EventHub — plan, view, and manage events
                </h2>

                <p className="mx-auto max-w-xl leading-relaxed text-gray-400">
                    A full-stack event management project. React Router drives the routing,
                    loaders and actions on the client, while a small Express API on Fly.io
                    serves the event data.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                        to="/events"
                        className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                    >
                        Browse events
                    </Link>

                    <Link
                        to="/events/new"
                        className="rounded-md px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-primary-300"
                    >
                        Create one
                    </Link>
                </div>
            </section>

            <section id="how-it-works" className="mb-16">
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    How it works
                </p>
                <h3 className="font-display mb-8 text-3xl font-bold tracking-tight text-gray-100">
                    A three-step flow
                </h3>

                <ol className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                    {steps.map((step, index) => (
                        <li key={step.title} className="flex flex-1 flex-col lg:flex-row lg:items-center lg:gap-0">
                            <article className="flex flex-1 flex-col rounded-xl border border-gray-800 bg-gray-800 p-6">
                                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/15 font-display text-sm font-bold text-primary-400">
                                    {index + 1}
                                </span>

                                <h4 className="font-display mb-1 text-lg font-semibold text-gray-100">
                                    {step.title}
                                </h4>

                                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400">
                                    {step.description}
                                </p>

                                <code className="self-start rounded-md bg-gray-900 px-2.5 py-1 font-mono text-xs text-primary-300">
                                    {step.tag}
                                </code>
                            </article>

                            {index < steps.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className="my-2 text-center text-xl text-gray-600 lg:my-0 lg:mx-2 lg:py-3"
                                >
                                    →
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </section>

            <section id="architecture" className="mb-16">
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    Architecture
                </p>
                <h3 className="font-display mb-8 text-3xl font-bold tracking-tight text-gray-100">
                    Request lifecycle
                </h3>

                <div className="flex flex-col items-stretch">
                    {layers.map((layer, index) => (
                        <div key={layer.title}>
                            <div className="rounded-xl border border-gray-800 bg-gray-800/60 p-6">
                                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                                    <h4 className="font-display text-lg font-semibold text-gray-100">
                                        {layer.title}
                                    </h4>

                                    {index === 0 ? (
                                        <span className="rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-400">
                                            this project
                                        </span>
                                    ) : index === layers.length - 1 ? (
                                        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-gray-400">
                                            storage
                                        </span>
                                    ) : null}
                                </div>

                                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                                    {layer.description}
                                </p>

                                <ul className="flex flex-wrap gap-2">
                                    {layer.items.map((item) => (
                                        <li
                                            key={item}
                                            className="rounded-md bg-gray-900 px-2.5 py-1 font-mono text-xs text-gray-300"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {index < layers.length - 1 && (
                                <div
                                    aria-hidden="true"
                                    className="flex justify-center py-2 text-xl text-gray-600"
                                >
                                    ↓
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section id="stack" className="mb-16">
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    Tech stack
                </p>
                <h3 className="font-display mb-8 text-3xl font-bold tracking-tight text-gray-100">
                    Built with
                </h3>

                <ul className="flex flex-wrap gap-3">
                    {stack.map((tool) => (
                        <li
                            key={tool}
                            className="rounded-full border border-gray-800 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300"
                        >
                            {tool}
                        </li>
                    ))}
                </ul>
            </section>

            <section id="getting-started" className="mb-4">
                <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-400">
                    Getting started
                </p>
                <h3 className="font-display mb-8 text-3xl font-bold tracking-tight text-gray-100">
                    Run it locally
                </h3>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                        <code>{`$ npm install\n$ npm run dev\n\n# backend already deployed — the client\n# talks to redux-events-backend.fly.dev`}</code>
                    </pre>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
