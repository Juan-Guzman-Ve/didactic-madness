import { User } from '../../src/domain/entities';

export class UserTestFactory {
  private user: User;

  constructor() {
    this.user = {
      id: `test-user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'default_hashed_password',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      roleId: '00000000-0000-0000-0000-000000000001', // Default role ID
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test-system',
      updatedBy: 'test-system',
    };
  }

  withId(id: string): UserTestFactory {
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

  withRole(roleId: string): UserTestFactory {
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
        id: `test-user-${Date.now()}-${i}`,
      };
    });
  }
}
