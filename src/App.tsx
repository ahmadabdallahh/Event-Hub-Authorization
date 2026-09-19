import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import { eventsLoader } from "./utils/eventLoader";
import EventsPageLoader from "./pages/EventsPageLoader";
import RootLayout from "./components/RootLayout";
import { fetchOneEvent } from "./utils/fetchOneEvent";
import { deleteItemAction } from "./utils/deleteItem";
import { addEvent } from "./utils/addEvent";
import Loading from "./components/Loading";
import { editEventDetails } from "./utils/editEventDetails";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

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
        path: "",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
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
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            }
        ],
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
