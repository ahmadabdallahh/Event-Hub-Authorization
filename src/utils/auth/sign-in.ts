// src/actions/sign-in.ts
import { redirect } from "react-router-dom";
import { AUTH_API_URL } from "../api";

export type SignInErrors = Partial<Record<"email" | "password", string>>;

export async function signIn({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return {
            error: "Please provide both email and password.",
        };
    }

    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return {
                error: errorData?.message || "Invalid email or password. Please try again.",
            };
        }

        const data = await response.json();

        if (data?.token) {
            localStorage.setItem("token", data.token);
        }

        return redirect('/events');

    } catch (error) {
        return {
            error: "Network error. Please check your connection and try again.",
        };
    }
}
