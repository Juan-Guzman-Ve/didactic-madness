import { IRepository } from './base/repository.interface';
import { User } from '../../../domain/entities';

/**
 * User-specific repository interface
 * Extends base repository with custom methods
 */
export interface IUserRepository extends IRepository<User> {
  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find users by role
   */
  findByRole(roleId: string): Promise<User[]>;

  /**
   * Find active users
   */
  findActiveUsers(): Promise<User[]>;

  /**
   * Check if email exists
   */
  emailExists(email: string): Promise<boolean>;
}
