import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { RoleUser } from '../../common/enums';

describe('AuthService', () => {
  let service: AuthService;
  const signAsyncMock = jest.fn();

  beforeEach(async () => {
    signAsyncMock.mockReset();
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

    const result = await service.auth({ login: 'admin' });

    expect(result).toEqual({ accessToken: 'token-value' });
    expect(signAsyncMock).toHaveBeenCalledWith(
      {
        login: 'admin',
        role: RoleUser.ADMIN,
      },
      { expiresIn: '1d' },
    );
  });

  it('throws not found when user does not exist', async () => {
    await expect(service.auth({ login: 'ghost' })).rejects.toBeInstanceOf(
      HttpException,
    );

    expect(signAsyncMock).not.toHaveBeenCalled();
  });
});
