import { IRepository } from './base/repository.interface';
import { Policy } from '../../../domain/entities';

/**
 * Policy-specific repository interface
 */
export interface IPolicyRepository extends IRepository<Policy> {
  /**
   * Find policy by name
   */
  findByName(name: string): Promise<Policy | null>;

  /**
   * Find policies by resource
   */
  findByResource(resource: string): Promise<Policy[]>;

  /**
   * Find policy by resource and action
   */
  findByResourceAndAction(resource: string, action: string): Promise<Policy | null>;
}
