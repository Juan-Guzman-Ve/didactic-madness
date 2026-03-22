import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@app/application/contracts/repositories';
import { User } from '@app/domain/entities';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    const isValid = user && await bcrypt.compare(pass, user.passwordHash);

    if (isValid) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      roleId: user.roleId,
      status: user.status
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId
      }
    };
  }

  async register(userData: Partial<User>) {
    const existing = await this.userRepository.findByEmail(userData.email!);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.passwordHash!, salt);

    const newUser = Object.assign(new User(), {
      ...userData,
      passwordHash: hashedPassword,
      status: 'Active'
    });

    return this.userRepository.create(newUser);
  }
}
