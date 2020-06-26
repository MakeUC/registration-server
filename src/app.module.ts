import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration.module';
import { Registrant } from './registrant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: process.env.DATABASE_URL,
      entities: [Registrant]
    }),
    RegistrationModule
  ],
})
export class AppModule {}
