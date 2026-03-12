import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Infrastructure
import { configurations, validationSchema } from './infra/config';
import { DatabaseModule } from './infra/database';

// Application Services
//import {} from './application/services';

// Presentation Controllers
import { HealthController } from './presentation/controllers';

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
  controllers: [AppController, HealthController],
  providers: [HealthController],
})
export class AppModule {}
