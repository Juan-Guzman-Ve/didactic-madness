import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from '@app/presentation/decorators/public.decorator';
import { 
  LoginCommandHandler, 
  RegisterCommandHandler,
  LoginCommand,
  RegisterCommand,
  AuthLoginResponse,
  AuthRegisterResponse,
  AuthUserResponse
} from '@app/application/features/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly loginCommandHandler: LoginCommandHandler,
    private readonly registerCommandHandler: RegisterCommandHandler
  ) {}

  @Public()
  @ApiBody({ type: LoginCommand })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return JWT' })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: AuthLoginResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginCommand): Promise<AuthLoginResponse> {
    const result = await this.loginCommandHandler.execute(body);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return result;
   
  }

  @Public()
  @ApiBody({ type: RegisterCommand })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthRegisterResponse })
  @ApiResponse({ status: 409, description: 'Conflict' })
  async register(@Body() body: RegisterCommand): Promise<AuthRegisterResponse> {
    const user = await this.registerCommandHandler.execute(body);
    // Ensure no sensitive data is returned
    return user;
  }
}
