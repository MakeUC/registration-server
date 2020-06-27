import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registrant.service';
import { Registrant } from './registrant.entity';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant ])
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, EmailService],
})
export class RegistrationModule {}
