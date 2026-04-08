import { RoleUser } from 'src/common/enums';

export const mockUsers = [
  {
    login: 'admin',
    password: '$2b$10$JX5I5JyhV3VVNZft5eNZkufRB9JwHEE7E5f8sz7Fv9B0oyFgWr28q',
    role: RoleUser.ADMIN,
  },
  {
    login: 'normal',
    password: '$2b$10$JX5I5JyhV3VVNZft5eNZkufRB9JwHEE7E5f8sz7Fv9B0oyFgWr28q',
    role: RoleUser.NORMAL,
  },
  {
    login: 'limited',
    password: '$2b$10$JX5I5JyhV3VVNZft5eNZkufRB9JwHEE7E5f8sz7Fv9B0oyFgWr28q',
    role: RoleUser.LIMITED,
  },
];
