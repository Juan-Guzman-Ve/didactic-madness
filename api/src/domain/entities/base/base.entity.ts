/**
 * Base entity interface
 * All domain entities should extend this interface
 */
export interface BaseEntity {
  id: string;
}

/**
 * Auditable entity interface
 * Provides audit trail fields for entities that require tracking
 */
export interface AuditableEntity extends BaseEntity {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}
