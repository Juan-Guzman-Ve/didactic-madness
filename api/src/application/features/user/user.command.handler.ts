import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY, ICommandHandler } from '@app/application';
import { User } from '@app/domain';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from './user.commands';
import { UserResponse } from './user.responses';
import { UserMapper } from './user.mapper';

@Injectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, UserResponse> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponse> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(command.passwordHash, salt);

    const user = Object.assign(new User(), {
      email: command.email,
      passwordHash: hashedPassword,
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phone,
      roleId: command.roleId,
      status: command.status ?? 'Active',
    });
    const saved = await this.userRepository.create(user);
    return UserMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand, UserResponse> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserResponse> {
    const existing = await this.userRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`User with ID ${command.id} not found`);

    let hashedPassword = command.passwordHash;
    if (command.passwordHash) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(command.passwordHash, salt);
    }

    const updated = await this.userRepository.updateById(command.id, {
      email: command.email,
      passwordHash: hashedPassword,
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phone,
      roleId: command.roleId,
      status: command.status,
    });
    return UserMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const exists = await this.userRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`User with ID ${command.id} not found`);
    await this.userRepository.deleteById(command.id);
  }
}
