import { User } from '../../src/domain/entities';

export class UserTestFactory {
  private user: User;

  constructor() {
    this.user = {
      id: Date.now(),
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'default_hashed_password',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      roleId: 1,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test-system',
      updatedBy: 'test-system',
    };
  }

  withId(id: number): UserTestFactory {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserTestFactory {
    this.user.email = email;
    return this;
  }

  withPassword(passwordHash: string): UserTestFactory {
    this.user.passwordHash = passwordHash;
    return this;
  }

  withName(firstName: string, lastName: string): UserTestFactory {
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    return this;
  }

  withPhone(phone: string): UserTestFactory {
    this.user.phone = phone;
    return this;
  }

  withRole(roleId: number): UserTestFactory {
    this.user.roleId = roleId;
    return this;
  }

  withStatus(status: string): UserTestFactory {
    this.user.status = status;
    return this;
  }

  active(): UserTestFactory {
    this.user.status = 'Active';
    return this;
  }

  inactive(): UserTestFactory {
    this.user.status = 'Inactive';
    return this;
  }

  build(): User {
    return { ...this.user };
  }

  static create(overrides?: Partial<User>): User {
    const factory = new UserTestFactory();
    return { ...factory.build(), ...overrides };
  }

  static createMany(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, (_, i) => {
      const factory = new UserTestFactory();
      return {
        ...factory.build(),
        ...overrides,
        email: `test-${Date.now()}-${i}@example.com`,
        id: Date.now() + i,
      };
    });
  }
}
