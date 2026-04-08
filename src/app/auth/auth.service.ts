import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { mockUsers } from 'src/mock/user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async auth(data: AuthDto) {
    const existUser = mockUsers.find((user) => user.login === data.login);

    if (!existUser) {
      throw new HttpException('User not fount', 404);
    }

    const isMatch = await bcrypt.compare(data.password, existUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
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
