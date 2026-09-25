// INFO: Sign Up A New User

import { redirect } from "react-router-dom";
import { AUTH_API_URL } from "../api";
import { getAuthToken } from "./authToken";

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
            "Authorization": `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
            // Backend 422 shape: { message, errors: { email?, password? } }
            // e.g. errors.email = "Email exists already." | "Invalid email."
            //      errors.password = "Invalid password. Must be at least 6 characters long."
            errors: (errorData?.errors ?? {}) as SignUpErrors,
            error: errorData?.message ?? "Failed to sign up. Please try again.",
        } satisfies SignUpActionData;
    }

    const { token } = await response.json();
    localStorage.setItem("token", token);

    return redirect("/");
}
