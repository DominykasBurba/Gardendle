const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const ACCESS_TOKEN_STORAGE_KEY = 'gardendle-access-token';

export type AuthenticatedUser = {
  userId: number;
  username: string;
};

export type AuthResult = AuthenticatedUser & {
  accessToken: string;
};

type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

async function readAuthResponse(response: Response): Promise<AuthResult> {
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(result?.message)
      ? result.message.join(', ')
      : result?.message;

    throw new Error(message ?? `Authentication failed: ${response.status}`);
  }

  return (await response.json()) as AuthResult;
}

export async function loginUser(
  usernameOrEmail: string,
  password: string,
): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameOrEmail, password }),
  });

  return readAuthResponse(response);
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return readAuthResponse(response);
}

export async function getCurrentUser(
  accessToken: string,
): Promise<AuthenticatedUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate user: ${response.status}`);
  }

  return (await response.json()) as AuthenticatedUser;
}
