import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrant } from './registrant.entity';
import { RegistrantDTO } from './registrant.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>
  ) {}
  
  fetchAll(): Promise<Registrant[]> {
    return this.registrants.find();
  }

  async register(data: RegistrantDTO): Promise<Registrant> {
    const newRegistrant: Registrant = await this.registrants.create(data);
    console.log({newRegistrant})
    await this.registrants.save(newRegistrant);
    return newRegistrant;
  }

}
