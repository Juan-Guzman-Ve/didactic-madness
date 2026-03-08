import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductImageEntity } from './product-image.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column('integer')
  price: number;

  @Column('integer')
  stock: number;

  @Column('jsonb', { nullable: true })
  specifications: Record<string, any>;

  @Column({ default: 'Active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  // Relations
  @OneToMany(() => ProductImageEntity, (image: ProductImageEntity) => image.product)
  images: ProductImageEntity[];

  // @ManyToOne(() => CategoryEntity)
  // @JoinColumn({ name: 'category_id' })
  // category: CategoryEntity;
}
