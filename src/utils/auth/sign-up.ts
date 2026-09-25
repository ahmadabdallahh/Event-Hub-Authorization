// INFO: Sign Up A New User

import { redirect } from "react-router-dom";
import { AUTH_API_URL } from "../api";

type SignUpErrors = {
    email?: string;
    password?: string;
};

export type SignUpActionData = {
    errors?: SignUpErrors;
    /** Fallback / summary message (e.g. network failure, server error). */
    error?: string;
};

export async function signUp({ request }: { request: Request }) {
    const formData = await request.formData();
    const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
            errors: (errorData?.errors ?? {}) as SignUpErrors,
            error: errorData?.message ?? "Failed to sign up. Please try again.",
        } satisfies SignUpActionData;
    }

    return redirect("/login");
}
