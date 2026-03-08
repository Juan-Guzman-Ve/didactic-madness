import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // TODO: Implement registration logic
    return {
      message: 'Registration endpoint - implementation pending',
      dto: registerDto,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // TODO: Implement login logic
    return {
      message: 'Login endpoint - implementation pending',
      dto: loginDto,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {
    // TODO: Implement logout logic (if needed for token invalidation)
    return;
  }
}
