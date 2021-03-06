import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration/registration.module';
import { LatticeModule } from './lattice/lattice.module';
import { StatsIntegrationModule } from './stats-integration/stats.module';
import { AppController } from './app.controller';
import { Registrant } from './registration/registrant.entity';
import { User } from './lattice/user.entity';
import { Match } from './lattice/match.entity';
import { Notification } from './lattice/notification.entity';
import { Subscription } from './lattice/subscription.entity';

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: databaseUrl,
      entities: [Registrant, User, Match, Notification, Subscription]
    }),
    RegistrationModule,
    StatsIntegrationModule,
    LatticeModule
  ],
  controllers: [AppController]
})
export class AppModule {}
