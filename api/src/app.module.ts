import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Infrastructure
import { configurations, validationSchema } from './infra/config';
import { DatabaseModule } from './infra/database';

// Application Services
//import {} from './application/services';

// Role Use Cases
import {
  CreateRoleCommandHandler,
  DeleteRoleCommandHandler,
  GetRoleByIdQueryHandler,
  ListRolesQueryHandler,
  UpdateRoleCommandHandler,
} from './application/features/role';

// Presentation Controllers
import { HealthController, RoleController } from './presentation/controllers';

@Module({
  imports: [
    // ─── Configuration ─────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
      validationSchema: validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    // ─── Infrastructure ────────────────────────────────────────────────────
    DatabaseModule,
  ],
  controllers: [AppController, HealthController, RoleController],
  providers: [
    CreateRoleCommandHandler,
    UpdateRoleCommandHandler,
    DeleteRoleCommandHandler,
    GetRoleByIdQueryHandler,
    ListRolesQueryHandler,
  ],
})
export class AppModule {}
