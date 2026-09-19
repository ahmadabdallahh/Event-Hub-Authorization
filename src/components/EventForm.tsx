import { Form, useNavigate } from 'react-router-dom';

interface EventFormProps {
    method?: "get" | "post" | "put" | "patch" | "delete";
    event?: {
        title: string;
        image: string;
        date: string;
        description: string;
    };
    action?: string | undefined;
}

const inputClass =
    'mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500 transition focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

const labelClass = 'mb-1 block text-sm font-medium text-gray-300';

function EventForm({ method = 'post', event, ...props }: EventFormProps) {
    const navigate = useNavigate();

    function cancelHandler() {
        navigate('..');
    }

    return (
        <Form
            method={method}
            className="mx-auto my-8 w-full max-w-2xl space-y-5 rounded-xl bg-gray-800 p-6 shadow-xl shadow-black/20 sm:p-8"
            action={props.action}
        >
            <p>
                <label htmlFor="title" className={labelClass}>
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    required
                    defaultValue={event?.title ?? ''}
                    className={inputClass}
                />
            </p>

            <p>
                <label htmlFor="image" className={labelClass}>
                    Image
                </label>
                <input
                    id="image"
                    type="url"
                    name="image"
                    required
                    defaultValue={event?.image ?? ''}
                    placeholder="https://example.com/event.jpg"
                    className={inputClass}
                />
            </p>

            <p>
                <label htmlFor="date" className={labelClass}>
                    Date
                </label>
                <input
                    id="date"
                    type="date"
                    name="date"
                    required
                    defaultValue={event?.date ?? ''}
                    className={`${inputClass} scheme-dark`}
                />
            </p>

            <p>
                <label htmlFor="description" className={labelClass}>
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    defaultValue={event?.description ?? ''}
                    className={`${inputClass} resize-y`}
                />
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={cancelHandler}
                    className="cursor-pointer rounded-md px-6 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-gray-100"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="cursor-pointer rounded-md bg-primary-500 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-primary-400 active:scale-[0.98]"
                >
                    Save
                </button>
            </div>
        </Form>
    );
}

export default EventForm;
