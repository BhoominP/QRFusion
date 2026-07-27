import { apiFetch } from './client';

export interface UserDto {
  id: number;
  email: string;
  name: string;
  authProvider?: string;
  avatarUrl?: string;
  createdAt: string;
}

export async function getCurrentUser(): Promise<UserDto | null> {
  const token = localStorage.getItem('qrfusion_token');
  if (!token) return null;

  try {
    const res = await apiFetch('/api/v1/auth/me');
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch current user profile:', err);
    return null;
  }
}

export async function updateProfile(data: { name?: string; avatarUrl?: string | null }): Promise<UserDto> {
  const res = await apiFetch('/api/v1/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function uploadAvatar(file: File): Promise<UserDto> {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await apiFetch('/api/v1/auth/avatar', {
    method: 'POST',
    body: formData,
  });
  return await res.json();
}
