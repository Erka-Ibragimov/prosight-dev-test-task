import { HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { mockUsers } from 'src/mock/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async auth(data: AuthDto) {
    const existUser = mockUsers.find((user) => user.login === data.login);

    if (!existUser) {
      throw new HttpException('User not fount', 404);
    }

    return {
      accessToken: await this.jwtService.signAsync(
        {
          role: existUser.role,
          login: existUser.login,
        },
        { expiresIn: '1d' },
      ),
    };
  }
}
