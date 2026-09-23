export interface UserInfo {
  id: string;
  email: string;
  role: string;
}

export const Role = {
  User: 'USER',
  Admin: 'ADMIN',
} as const;

export type Role = typeof Role[keyof typeof Role];
