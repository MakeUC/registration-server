import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration/registration.module';
import { Registrant } from './registration/registrant.entity';
import { StatsIntegrationModule } from './stats-integration/stats.module';
import { AppController } from './app.controller';

const databaseUrl = process.env.DATABASE_URL;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: databaseUrl,
      entities: [Registrant]
    }),
    RegistrationModule,
    StatsIntegrationModule
  ],
  controllers: [AppController]
})
export class AppModule {}
