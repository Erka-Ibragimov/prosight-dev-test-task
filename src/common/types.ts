import { RoleUser } from './enums';

export type CurrentUser = {
  login: string;
  role: RoleUser;
};

export type DatabaseType = 'postgres' | 'mysql';
