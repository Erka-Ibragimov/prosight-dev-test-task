import { RoleUser } from 'src/common/enums';

export const mockUsers = [
  {
    login: 'admin',
    role: RoleUser.ADMIN,
  },
  {
    login: 'normal',
    role: RoleUser.NORMAL,
  },
  {
    login: 'limited',
    role: RoleUser.LIMITED,
  },
];
