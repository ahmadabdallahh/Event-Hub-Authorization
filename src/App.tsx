import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import { eventsLoader } from "./utils/events functions/eventLoader";
import EventsPageLoader from "./pages/EventsPageLoader";
import RootLayout from "./components/RootLayout";
import { fetchOneEvent } from "./utils/events functions/fetchOneEvent";
import { deleteItemAction } from "./utils/events functions/deleteItem";
import { addEvent } from "./utils/events functions/addEvent";
import Loading from "./components/Loading";
import { editEventDetails } from "./utils/events functions/editEventDetails";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { signUp } from "./utils/auth/sign-up";
import { signIn } from "./utils/auth/sign-in";
import { logoutAction, sessionLoader } from "./utils/auth/session";

const EditEventPage = lazy(() => import("./pages/EditEventPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const NewEventPage = lazy(() => import("./pages/NewEventPage"));

function lazyRoute(Component: React.LazyExoticComponent<() => React.JSX.Element>) {
    return (
        <Suspense fallback={
            <Loading />
        }>
            <Component />
        </Suspense>
    );
}

const router = createBrowserRouter([
    {
        id: "root",
        path: "",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        loader: sessionLoader,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "events",
                children: [
                    {
                        index: true,
                        element: <EventsPageLoader />,
                        loader: eventsLoader,
                    },
                    {
                        path: "new",
                        element: lazyRoute(NewEventPage),
                        action: addEvent,
                    },
                    {
                        path: ":id",
                        element: lazyRoute(EventDetailPage),
                        loader: fetchOneEvent,
                        action: deleteItemAction,
                    },
                    {
                        path: ":id/edit",
                        element: lazyRoute(EditEventPage),
                        loader: fetchOneEvent,
                        action: editEventDetails,
                    }
                ],
            },
            {
                path: "/login",
                element: <LoginPage />,
                action: signIn
            },
            {
                path: "/register",
                element: <RegisterPage />,
                action: signUp
            },
            {
                // No element: the action clears the cookie and redirects to /login.
                path: "/logout",
                action: logoutAction
            }
        ],
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
