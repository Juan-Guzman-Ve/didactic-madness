import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditableEntity } from '../entities/base';

/**
 * TypeORM subscriber to automatically populate audit fields
 * 
 * Automatically sets:
 * - createdBy: User ID on insert (from request context)
 * - updatedBy: User ID on update (from request context)
 * - createdAt: Timestamp on insert (handled by @CreateDateColumn)
 * - updatedAt: Timestamp on update (handled by @UpdateDateColumn)
 * 
 * Usage:
 * - Register in DatabaseModule providers
 * - Set current user in request context via middleware/interceptor
 * 
 * TODO: Implement request context to get current user ID
 */
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditableEntity> {
  /**
   * Listen to all entities that extend AuditableEntity
   */
  listenTo() {
    return AuditableEntity;
  }

  /**
   * Called before entity insertion
   * Sets createdBy field from request context
   */
  beforeInsert(event: InsertEvent<AuditableEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.createdBy = userId;
    }
  }

  /**
   * Called before entity update
   * Sets updatedBy field from request context
   */
  beforeUpdate(event: UpdateEvent<AuditableEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }

  /**
   * Get current user ID from request context
   * 
   * TODO: Implement proper request context using cls-hooked or AsyncLocalStorage
   * For now, returns undefined (manual setting required)
   * 
   * Example implementation:
   * ```typescript
   * const requestContext = RequestContext.currentContext();
   * return requestContext?.user?.id;
   * ```
   */
  private getCurrentUserId(): string | undefined {
    // TODO: Implement request context to retrieve current user
    return undefined;
  }
}
