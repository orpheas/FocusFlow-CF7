export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let errorBody: any = undefined;
    try {
      errorBody = await res.json();
    } catch {}
    const error = (errorBody && errorBody.error) || res.statusText || 'REQUEST_FAILED';
    throw new Error(String(error));
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}





