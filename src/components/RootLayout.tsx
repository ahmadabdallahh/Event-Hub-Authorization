import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? 'rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-primary-400'
        : 'rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-primary-300';

function RootLayout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isAuthPage = isLoginPage || location.pathname === '/register';

    const authLinkClass = isAuthPage
        ? 'rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-primary-400'
        : 'rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-primary-300';

    return (
        <div className="min-h-dvh bg-gray-900 text-gray-100">
            <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link
                        to="/"
                        className="font-display text-lg font-bold tracking-tight text-gray-100"
                    >
                        Event<span className="text-primary-500">Hub</span>
                    </Link>

                    <ul className="flex items-center gap-2">
                        <li>
                            <NavLink to="/" end className={linkClass}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/events" end className={linkClass}>
                                Events
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/events/new" end className={linkClass}>
                                Add Event
                            </NavLink>
                        </li>

                        <li>
                            <Link to={isLoginPage ? "/register" : "/login"} className={authLinkClass}>
                                {isLoginPage ? "Register" : "Sign in"}
                            </Link>
                        </li>

                    </ul>
                </nav>
            </header>

            <main className="mx-auto w-full max-w-6xl px-6 pb-16">
                <Outlet />
            </main>

            <footer className="border-t border-gray-800">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-gray-500">
                    <p>EventHub — a React + React Router practice project.</p>
                    <p>Events served from an Express API on Fly.io.</p>
                </div>
            </footer>
        </div>
    );
}

export default RootLayout;
