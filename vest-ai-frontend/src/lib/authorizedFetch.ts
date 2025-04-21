const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authorizedFetch(input: RequestInfo, init?: RequestInit) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(init?.headers || {}),
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  return fetch(input, {
    ...init,
    headers,
  });
}
