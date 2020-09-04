import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Registrant } from '../../registration/registrant.entity';
import { User } from '../user.entity';
import { CurrentUserDTO } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService
  ) {}

  async getRegistrantEmail(registrantId: string): Promise<string> {
    try {
      const registrant: Registrant = await this.registrants.findOne(registrantId);
      if(!registrant || !registrant.isVerified) {
        throw new HttpException(`Invalid registrant`, HttpStatus.UNAUTHORIZED);
      }
      return registrant.email;
    } catch (err) {
      throw new HttpException(`Please check the link or try again later`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUser(email: string): Promise<User> {
    return this.users.findOne({ email });
  }

  async validateUser(payload: CurrentUserDTO): Promise<User> {
    return this.users.findOne(payload.id);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.users.findOne({ email });
    if(!user) {
      throw new HttpException(`Invalid credentials`, HttpStatus.UNAUTHORIZED);
    }

    const auth = await user.comparePassword(password);
    if(!auth) {
      throw new HttpException(`Invalid credentials`, HttpStatus.UNAUTHORIZED);
    }

    return this.jwtService.signAsync({ id: user.id });
  }

  async register(registrantId: string, password: string): Promise<string> {
    const registrant: Registrant = await this.registrants.findOne(registrantId);
    if(!registrant) {
      throw new HttpException(`Registrant not found`, HttpStatus.NOT_FOUND);
    }

    const existingUser: User = await this.users.findOne({ registrantId });
    if(existingUser) {
      throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
    }

    const user = this.users.create({ registrantId, password, email: registrant.email });
    const insertedUser = await this.users.save(user);

    return this.jwtService.signAsync({ id: insertedUser.id });
  }

  async sendResetLink(email: string): Promise<void> {
    return;
  }
}
