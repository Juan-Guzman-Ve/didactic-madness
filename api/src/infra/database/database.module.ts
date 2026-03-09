import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';
import * as entities from './entities';
import { 
  UserRepository, 
  ProductRepository, 
  CategoryRepository, 
  OrderRepository,
} from './repositories';
import { AuditSubscriber } from './subscribers';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  providers: [
    UserRepository,
    ProductRepository,
    CategoryRepository,
    OrderRepository,
    AuditSubscriber,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    ProductRepository,
    CategoryRepository,
    OrderRepository,
  ],
})
export class DatabaseModule {}
