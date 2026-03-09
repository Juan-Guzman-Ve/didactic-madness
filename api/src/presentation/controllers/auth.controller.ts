import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // TODO: Implement authentication endpoints
  // - POST /auth/register
  // - POST /auth/login
  // - POST /auth/logout
  // - POST /auth/refresh
}
