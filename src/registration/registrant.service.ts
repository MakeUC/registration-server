import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrant } from './registrant.entity';
import { RegistrantDTO } from './registrant.dto';
import { FileService } from './file.service';
import { EmailService } from './email.service';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    private fileService: FileService,
    private emailService: EmailService
  ) {}

  async register(data: RegistrantDTO, resume: File): Promise<Registrant> {
    const existing = await this.registrants.find({ where: { email: data.email } });
    if(existing.length) {
      throw new HttpException(`Registrant already exists`, HttpStatus.BAD_REQUEST);
    }
    const newRegistrant: Registrant = this.registrants.create(data);
    newRegistrant.resumeUrl = await this.fileService.uploadResume(resume, newRegistrant);
    await this.registrants.save(newRegistrant);
    this.emailService.sendVerificationEmail(newRegistrant);
    return newRegistrant;
  }

  async verify(id: string): Promise<Registrant> {
    const registrant: Registrant = await this.registrants.findOne(id);
    if(registrant.isVerified) {
      throw new HttpException(`Registrant already verified`, HttpStatus.BAD_REQUEST);
    }
    registrant.isVerified = true;
    return await this.registrants.save(registrant);
  }
}
