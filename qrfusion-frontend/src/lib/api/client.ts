const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  let message = response.statusText || `Request failed with status ${response.status}`;
  let fieldErrors: Record<string, string> | undefined;

  try {
    const text = await response.text();
    if (text) {
      try {
        const body = JSON.parse(text);
        message = body.error ?? body.message ?? message;
        if (body.fieldErrors && typeof body.fieldErrors === 'object') {
          fieldErrors = body.fieldErrors;
        }
      } catch {
        message = text;
      }
    }
  } catch {
    // response body wasn't readable — fallback to status text
  }

  throw new ApiError(response.status, message, fieldErrors);
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  
  const headers = new Headers(init?.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', '*/*');
  }

  // Attach JWT Bearer token if present
  const token = localStorage.getItem('qrfusion_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw err;
    }
    throw new ApiError(0, "Unable to connect to QRFusion backend server.");
  }

  // Handle 401 Unauthorized by clearing invalid token without redirecting guest users away
  if (response.status === 401) {
    if (localStorage.getItem('qrfusion_token')) {
      localStorage.removeItem('qrfusion_token');
    }
    await handleErrorResponse(response);
  }

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response;
}

export const fetchApi = apiFetch;
