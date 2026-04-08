import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authMock = jest.fn();

  beforeEach(async () => {
    authMock.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            auth: authMock,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates auth call to service', async () => {
    const payload = { login: 'admin', password: 'admin' };
    const expected = { accessToken: 'token' };
    authMock.mockResolvedValue(expected);

    const result = await controller.auth(payload);

    expect(result).toEqual(expected);
    expect(authMock).toHaveBeenCalledWith(payload);
  });
});
