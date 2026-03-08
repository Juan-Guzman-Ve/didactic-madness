import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusHistoryEntity } from './order-status-history.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'address_id' })
  addressId: string;

  @Column()
  status: string;

  @Column('integer', { name: 'total_amount' })
  totalAmount: number;

  @Column({ name: 'payment_status', default: 'Pending' })
  paymentStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @OneToMany(() => OrderStatusHistoryEntity, (history) => history.order)
  statusHistory: OrderStatusHistoryEntity[];
}
