// INFO: Sign Up A New User

import { redirect } from "react-router-dom";
import { AUTH_API_URL } from "../api";

export async function signUp({ request }: { request: Request }) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return { error: 'Please provide a valid email and password.' };
    }

    const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
            error: errorData?.message || 'Failed to sign up. Please try again.'
        };
    }

    return redirect('/login');
}
