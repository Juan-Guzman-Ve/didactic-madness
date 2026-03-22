import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditableEntity } from '../entities/base';
import { RequestContextHolder } from '../../config/request-context';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditableEntity> {
  listenTo() {
    return AuditableEntity;
  }

  beforeInsert(event: InsertEvent<AuditableEntity>) {
    const userId = RequestContextHolder.getUserId() || 'System';
    if (!event.entity.createdBy) {
      event.entity.createdBy = userId;
    }
    if (!event.entity.updatedBy) {
      event.entity.updatedBy = userId;
    }
  }

  beforeUpdate(event: UpdateEvent<AuditableEntity>) {
    const userId = RequestContextHolder.getUserId() || 'System';
    if (event.entity) {
      event.entity.updatedBy = userId;
    }
  }
}
