// Domain Entity: Rich model with business logic
export class User {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _firstName: string,
    private _lastName: string,
    private _phone: string | null,
    private _status: UserStatus,
    private _createdAt: Date,
  ) {}

  // Factory method
  static create(email: string, firstName: string, lastName: string, phone?: string): User {
    return new User(
      crypto.randomUUID(),
      email,
      firstName,
      lastName,
      phone || null,
      UserStatus.ACTIVE,
      new Date(),
    );
  }

  // Reconstruct from database
  static fromPersistence(data: UserPersistence): User {
    return new User(
      data.id,
      data.email,
      data.firstName,
      data.lastName,
      data.phone,
      data.status as UserStatus,
      data.createdAt,
    );
  }

  // Getters
  get email(): string {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get phone(): string | null {
    return this._phone;
  }

  get status(): UserStatus {
    return this._status;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  // Business logic
  deactivate(): void {
    if (this._status === UserStatus.SUSPENDED) {
      throw new Error('User is already suspended');
    }
    this._status = UserStatus.SUSPENDED;
  }

  activate(): void {
    this._status = UserStatus.ACTIVE;
  }

  updateProfile(firstName: string, lastName: string, phone?: string): void {
    this._firstName = firstName;
    this._lastName = lastName;
    if (phone !== undefined) {
      this._phone = phone;
    }
  }

  // Map to persistence
  toPersistence(): UserPersistence {
    return {
      id: this.id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      phone: this._phone,
      status: this._status,
      createdAt: this._createdAt,
    };
  }
}

export enum UserStatus {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
}

export interface UserPersistence {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  createdAt: Date;
}
