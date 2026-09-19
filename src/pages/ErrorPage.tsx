import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

function getDetailMessage(data: unknown, fallback: string): string {
    if (typeof data === 'string' && data) {
        return data;
    }

    if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = (data as { message: unknown }).message;
        if (typeof message === 'string' && message) {
            return message;
        }
    }

    return fallback;
}

const ErrorPage = () => {
    const error = useRouteError();

    let status = 'Error';
    let title = 'Something went wrong';
    let message = 'Something went wrong while loading this page.';

    if (isRouteErrorResponse(error)) {
        status = String(error.status);

        switch (error.status) {
            case 400:
                title = 'Invalid request';
                message = getDetailMessage(error.data, 'The request could not be understood. Please try again.');
                break;
            case 401:
                title = 'You are not authenticated';
                message = getDetailMessage(
                    error.data,
                    'You cannot view or edit this page because you are not signed in. Please sign in and try again.'
                );
                break;
            case 403:
                title = 'You are not authorized to view this page';
                message = getDetailMessage(
                    error.data,
                    'You do not have permission to view or edit this page.'
                );
                break;
            case 404:
                title = 'Page not found';
                message = getDetailMessage(error.data, 'The page or event you are looking for does not exist.');
                break;
            case 422:
                title = 'Validation failed';
                message = getDetailMessage(error.data, 'Some of the submitted data is invalid. Please check and try again.');
                break;
            case 500:
                title = 'Something went wrong on the server';
                message = getDetailMessage(error.data, 'The server failed to handle your request. Please try again later.');
                break;
            default:
                title = 'Could not load this page';
                message = getDetailMessage(error.data, error.statusText || message);
                break;
        }
    } else if (error instanceof Error) {
        message = error.message || message;
    }

    const isUnauthenticated = status === '401';

    return (
        <div className="mx-auto flex min-h-[60dvh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-400 tabular-nums">
                {status}
            </p>

            <h1 className="font-display text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                {title}
            </h1>

            <p className="mx-auto mt-3 max-w-md leading-relaxed text-gray-400">
                {message}
            </p>

            <div className="mt-8 flex items-center gap-3">
                {isUnauthenticated ? (
                    <Link
                        to="/login"
                        className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                    >
                        Sign in
                    </Link>
                ) : (
                    <Link
                        to="/"
                        className="rounded-md bg-primary-500 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                    >
                        Back to home
                    </Link>
                )}

                <Link
                    to="/events"
                    className="rounded-md px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-primary-300"
                >
                    Try events again
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
