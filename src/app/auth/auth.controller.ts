import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Authenticate by login' })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    description: 'Returns bearer access token',
    type: AuthResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async auth(@Body() data: AuthDto) {
    return this.authService.auth(data);
  }
}
