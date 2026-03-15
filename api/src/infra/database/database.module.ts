import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '@app/infra/database/database.config';
import * as entities from '@app/infra/database/entities';
import { RoleRepository } from '@app/infra/database/repositories/role.repository';
import { ROLE_REPOSITORY } from '@app/application';

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
    RoleRepository,
    { provide: ROLE_REPOSITORY, useExisting: RoleRepository },
  ],
  exports: [TypeOrmModule, ROLE_REPOSITORY],
})
export class DatabaseModule {}

