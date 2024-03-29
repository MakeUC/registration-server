import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration/registration.module';
import { LatticeModule } from './lattice/lattice.module';
import { StatsIntegrationModule } from './stats-integration/stats.module';
import { AppController } from './app.controller';
import { Registrant } from './registration/registrant.entity';
import { User } from './lattice/user.entity';
import { Swipe } from './lattice/swipe.entity';
import { Notification } from './lattice/notification.entity';
import { Subscription } from './lattice/subscription.entity';
import { Skill } from './lattice/skill.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: databaseUrl,
      entities: [Registrant, User, Swipe, Notification, Subscription, Skill]
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'static'),
        serveRoot: '/static'
      }),
    RegistrationModule,
    StatsIntegrationModule,
    LatticeModule
  ],
  controllers: [AppController]
})
export class AppModule {}
