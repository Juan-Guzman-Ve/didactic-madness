import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database.config';
import * as entities from './entities';
import { RoleRepository } from './repositories';

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
  providers: [RoleRepository],
  exports: [TypeOrmModule, RoleRepository],
})
export class DatabaseModule {}
