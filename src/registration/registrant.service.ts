import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrant } from './registrant.entity';
import { RegistrantDTO } from './registrant.dto';
import { FileService } from './file.service';
import { EmailService } from './email.service';
import { WebhookService } from './webhook.service';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    private fileService: FileService,
    private emailService: EmailService,
    private webhookService: WebhookService
  ) {}

  async register(data: RegistrantDTO, resume: Express.Multer.File): Promise<Registrant> {
    const existing = await this.registrants.find({ where: { email: data.email } });
    if(existing.length) {
      throw new HttpException(`Email already exists`, HttpStatus.BAD_REQUEST);
    }

    const newRegistrant: Registrant = this.registrants.create(data);
    newRegistrant.registeredAt = new Date();
    newRegistrant.resumeUrl = resume ? await this.fileService.uploadResume(resume, newRegistrant) : ``;

    try {
      await this.registrants.save(newRegistrant);
    } catch (err) {
      Logger.error(err);
      throw new HttpException(`Error inserting registrant data into database: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.emailService.sendVerificationEmail(newRegistrant);

    if(data.questions.trim().length) {
      this.webhookService.sendQuestionWebhook(data);
    }

    return newRegistrant;
  }

  async verify(id: string): Promise<boolean> {
    const registrant: Registrant = await this.registrants.findOne(id);
    if(registrant.isVerified) {
      return false;
    }
    registrant.isVerified = true;
    registrant.verifiedAt = new Date();
    await this.registrants.save(registrant);
    return true;
  }
}
