import type { Admin } from './admin.type';

interface AuthContext {
  isAuth: boolean;
  admin: Admin | null;
}
export type { AuthContext };
