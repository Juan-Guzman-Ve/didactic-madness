import { Injectable, UnauthorizedException, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CART_REPOSITORY, ICartRepository, IRoleRepository, IUserRepository, ROLE_REPOSITORY, USER_REPOSITORY } from '@app/application/contracts/repositories';
import { RegisterCommand, LoginCommand } from './auth.commands';
import { User } from '@app/domain/entities/user.entity';
import { ICommandHandler } from '@app/application';
import { AuthLoginResponse, AuthRegisterResponse } from '@app/application/features/auth/auth.responses';
import { In } from 'typeorm';
import { Cart } from '@app/domain/entities/cart.entity';

const CUSTOMER_ROLE_NAME = 'Customer';

@Injectable()
export class LoginCommandHandler implements ICommandHandler<LoginCommand, AuthLoginResponse> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) :  Promise<AuthLoginResponse> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(command.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
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
        roleId: user.roleId,
        status: user.status
      }
    };
  }
}

  
@Injectable()
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand, AuthRegisterResponse> {

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(CART_REPOSITORY) private readonly cartRepository: ICartRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RegisterCommand) : Promise<AuthRegisterResponse> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(command.password, salt);

    const customerRole = await this.roleRepository.findByName(CUSTOMER_ROLE_NAME);
    if (!customerRole) {
      throw new InternalServerErrorException(`Default role \"${CUSTOMER_ROLE_NAME}\" is not configured`);
    }

    const newUser = Object.assign(new User(), {
      email: command.email,
      firstName: command.firstName,
      lastName: command.lastName,
      passwordHash: hashedPassword,
      status: 'Active',
      roleId: customerRole.id,
    });

    const createdUser = await this.userRepository.create(newUser);

    const cart = Object.assign(new Cart(), { userId: createdUser.id });
    await this.cartRepository.create(cart);

    return {
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      roleId: createdUser.roleId,
      status: createdUser.status
    };
  }
}
