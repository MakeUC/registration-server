import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Registrant } from './registrant.entity';
import { RegistrantDTO } from './registrant.dto';
import { FileService } from './file.service';
import { EmailService } from './email.service';
import { WebhookService } from './webhook.service';

// Set this to false when registration opens up again
const isRegistrationClosed = true;

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    private fileService: FileService,
    private emailService: EmailService,
    private webhookService: WebhookService
  ) {}

  private async validateRegistrant(registrant: Registrant): Promise<void> {
    try {
      return await validateOrReject(registrant);
    } catch (err) {
      Logger.error(`Validation error`);
      Logger.error(err);
      throw new HttpException(`Invalid registrant fields`, HttpStatus.BAD_REQUEST);
    }
  }

  async register(data: RegistrantDTO, resume: Express.Multer.File): Promise<Registrant> {
    if(isRegistrationClosed) {
      throw new HttpException(`Registration is closed for this year, please check us out next year!`, HttpStatus.FORBIDDEN);
    }

    const existing = await this.registrants.find({ where: { email: data.email } });
    if(existing.length) {
      throw new HttpException(`Email already exists`, HttpStatus.BAD_REQUEST);
    }

    const newRegistrant: Registrant = this.registrants.create(data);
    newRegistrant.registeredAt = new Date();
    newRegistrant.resumeUrl = resume ? await this.fileService.uploadResume(resume, newRegistrant) : ``;

    await this.validateRegistrant(newRegistrant);

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

    await this.validateRegistrant(registrant);
    await this.registrants.save(registrant);
    return true;
  }

  async verifyByEmail(email: string): Promise<Registrant> {
    const registrant: Registrant = await this.registrants.findOne({ email });
    if(!registrant) {
      throw new HttpException(`Registrant not found`, HttpStatus.NOT_FOUND);
    }
    if(registrant.isVerified) {
      return registrant;
    }
    registrant.isVerified = true;
    registrant.verifiedAt = new Date();

    await this.validateRegistrant(registrant);
    await this.registrants.save(registrant);
    return registrant;
  }

  async sendSecondVerification(): Promise<void> {
    Logger.log(`Sending verification email to all unverified registrants`);
    const registrants = await this.registrants.find({ isVerified: null });
    Logger.log(`Found ${registrants.length} unverified registrants`);
    registrants.forEach(registrant => this.emailService.sendVerificationEmail(registrant));
  }

  async checkIn(email: string): Promise<string> {
    const registrant = await this.registrants.findOne({ email, isVerified: true });

    if(!registrant) {
      return `Couldn't find a registration with the email ${email}. Please make sure that the email is correct, and you have verified your email.`;
    }

    if(registrant.isCheckedIn) {
      return `Hello ${registrant.fullName}, you are already checked in!`;
    }

    registrant.isCheckedIn = true;
    registrant.checkedInAt = new Date();

    await this.registrants.save(registrant);

    return `Hello ${registrant.fullName}, you are successfully checked in, welcome to MakeUC!`;
  }
}
