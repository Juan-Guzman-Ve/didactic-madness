import { IRepository } from './base/repository.interface';
import { Role, Policy } from '../../../domain/entities';

/**
 * Role-specific repository interface
 */
export interface IRoleRepository extends IRepository<Role> {
  /**
   * Find role by name
   */
  findByName(name: string): Promise<Role | null>;

  /**
   * Get all policies for a role
   */
  getPoliciesForRole(roleId: string): Promise<Policy[]>;

  /**
   * Assign policy to role
   */
  assignPolicy(roleId: string, policyId: string): Promise<void>;

  /**
   * Remove policy from role
   */
  removePolicy(roleId: string, policyId: string): Promise<void>;

  /**
   * Check if role has specific policy
   */
  hasPolicy(roleId: string, policyId: string): Promise<boolean>;
}
