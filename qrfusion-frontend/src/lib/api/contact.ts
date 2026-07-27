import { apiFetch } from './client';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(payload: ContactFormPayload) {
  // Stub contact POST request to /api/v1/contact endpoint
  const res = await apiFetch('/api/v1/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}
