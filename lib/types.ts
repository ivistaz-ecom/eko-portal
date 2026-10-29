export type EkoUser = {
  id: number;
  loginKey: string;
  username: string;
  email: string | null;
  name: string;
  phone: string | null;
  language: string | null;
  city: string | null;
  department: string | null;
  jobTitle: string | null;
  photoUrl: string | null;
  role: 'super_admin' | 'admin' | 'employee';
  lastLoginAt: string | null;
};

export type SessionInfo = {
  idleExpiresAt: string;
  absoluteExpiresAt: string | null;
  idleTimeoutMinutes: number;
};

export type PublicConfig = {
  appName: string;
  allowedDomains: string[];
  idleTimeoutMinutes: number;
  languages: string[];
};
