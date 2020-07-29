import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration/registration.module';
import { Registrant } from './registration/registrant.entity';
import { SlackModule } from './slack/slack.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: process.env.DATABASE_URL,
      entities: [Registrant]
    }),
    RegistrationModule,
    SlackModule
  ],
  controllers: [AppController]
})
export class AppModule {}
