import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { AdminController } from './admin.controller';
import { RegistrationService } from './registrant.service';
import { Registrant } from './registrant.entity';
import { FileService } from './file.service';
import { EmailService } from './email.service';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Registrant ]),
    HttpModule
  ],
  controllers: [RegistrationController, AdminController],
  providers: [
    RegistrationService,
    FileService,
    EmailService,
    WebhookService
  ],
})
export class RegistrationModule {}
