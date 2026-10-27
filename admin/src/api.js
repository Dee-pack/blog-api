const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = { ...options.headers };
    if (options.body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(
            data?.error || data?.errors?.[0]?.msg || "Something went wrong"
        );
    }

    return data;
}