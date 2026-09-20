// INFO: Sign Up A New User

import { AUTH_API_URL } from "../api";

export async function signUp(email: string, password: string) {
    const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to sign up');
    }

    return response.json();
}
