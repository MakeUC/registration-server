import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registrant.service';
import { Registrant } from './registrant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant ])
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
