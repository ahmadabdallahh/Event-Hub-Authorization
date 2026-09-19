import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? 'rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-primary-400'
        : 'rounded-md bg-gray-700 px-6 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-600 hover:text-gray-100';

function EventsNavigation() {
    return (
        <header className="flex justify-center px-6 py-8">
            <nav>
                <ul className="flex items-center gap-3">
                    <li>
                        <NavLink to="/events" end className={linkClass}>
                            All Events
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/events/new" className={linkClass}>
                            New Event
                        </NavLink>

                        <li>
                            <NavLink to="/login" className={linkClass}>
                                Login
                            </NavLink>
                        </li>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default EventsNavigation;
