import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { RoleUser } from '../../common/enums';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const signAsyncMock = jest.fn();
  const bcryptCompareMock = jest.mocked(bcrypt.compare);

  beforeEach(async () => {
    signAsyncMock.mockReset();
    bcryptCompareMock.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: signAsyncMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns token for existing user', async () => {
    signAsyncMock.mockResolvedValue('token-value');
    bcryptCompareMock.mockResolvedValue(true as never);

    const result = await service.auth({ login: 'admin', password: 'admin' });

    expect(result).toEqual({ accessToken: 'token-value' });
    expect(bcryptCompareMock).toHaveBeenCalled();
    expect(signAsyncMock).toHaveBeenCalledWith(
      {
        login: 'admin',
        role: RoleUser.ADMIN,
      },
      { expiresIn: '1d' },
    );
  });

  it('throws not found when user does not exist', async () => {
    await expect(
      service.auth({ login: 'ghost', password: 'any' }),
    ).rejects.toBeInstanceOf(HttpException);

    expect(bcryptCompareMock).not.toHaveBeenCalled();
    expect(signAsyncMock).not.toHaveBeenCalled();
  });

  it('throws unauthorized when password is invalid', async () => {
    bcryptCompareMock.mockResolvedValue(false as never);

    await expect(
      service.auth({ login: 'admin', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(signAsyncMock).not.toHaveBeenCalled();
  });
});
