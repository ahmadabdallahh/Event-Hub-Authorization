// INFO: Single source of truth for backend API URLs.
// Backend mounts: /api/v1/auth (signup, login) + /api/v1/events (/,:id)

const rawBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const EVENTS_API_URL = `${API_BASE_URL}/events/`;

export const AUTH_API_URL = `${API_BASE_URL}/auth`;
