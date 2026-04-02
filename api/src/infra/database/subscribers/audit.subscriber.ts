import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditableEntity } from '../entities/base';
import { RequestContextHolder } from '../../config/request-context';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditableEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AuditableEntity;
  }

  beforeInsert(event: InsertEvent<AuditableEntity>) {
    const userId = RequestContextHolder.getUserId() ?? 'System';
    event.entity.createdBy ??= userId;
    event.entity.updatedBy ??= userId;
  }

  beforeUpdate(event: UpdateEvent<AuditableEntity>) {
    const userId = RequestContextHolder.getUserId() ?? 'System';
    if (event.entity) {
      event.entity.updatedBy = userId;
    }
  }
}
