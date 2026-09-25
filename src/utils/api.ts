// INFO: Single source of truth for backend API URLs.
import { redirect } from "react-router-dom";
// Backend mounts: /api/v1/auth (signup, login) + /api/v1/events (/,:id)

const rawBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const EVENTS_API_URL = `${API_BASE_URL}/events/`;

export const AUTH_API_URL = `${API_BASE_URL}/auth`;

/**
 * Cookie-authenticated fetch. Sends the httpOnly `token` cookie and
 * auto-logs-out on 401: clears the server cookie, then bounces to /login.
 * Auth endpoints themselves are excluded so failed logins still surface
 * their error message instead of redirecting.
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetch(input, { credentials: "include", ...init });

    if (response.status === 401 && !input.includes("/auth/")) {
        await fetch(`${AUTH_API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        }).catch(() => {
            // Cookie already gone/expired — still redirect below.
        });
        throw redirect("/login");
    }

    return response;
}
