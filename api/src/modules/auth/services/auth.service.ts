import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // TODO: Implement registration
    // 1. Create domain User entity from DTO
    // 2. Hash password
    // 3. Save to database
    // 4. Return JWT token
    throw new Error('Not implemented');
  }

  async login(loginDto: LoginDto) {
    // TODO: Implement login
    // 1. Find user by email
    // 2. Verify password
    // 3. Generate JWT token
    // 4. Return token and user info
    throw new Error('Not implemented');
  }

  async validateUser(userId: string) {
    // TODO: Implement user validation for JWT strategy
    // Load user with role and policies
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePolicies', 'role.rolePolicies.policy'],
    });
  }
}
