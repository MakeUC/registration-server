import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { EmailService } from 'src/registration/email.service';
import { Registrant } from '../../registration/registrant.entity';
import { User } from '../user.entity';
import { CurrentUserDTO, ResetTokenDTO } from './dtos';

const latticeHost = process.env.LATTICE_HOST;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async getRegistrantEmail(registrantId: string): Promise<string> {
    try {
      const registrant = await this.registrants.findOneBy({ id: registrantId });
      if(!registrant || !registrant.isVerified) {
        throw new HttpException(`Invalid registrant`, HttpStatus.UNAUTHORIZED);
      }
      return registrant.email;
    } catch (err) {
      throw new HttpException(`Please check the link or try again later`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUser(email: string): Promise<User> {
    const user = await this.users.findOneBy({ email });
    if(!user) {
      throw new HttpException(`No user found with this email`, HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async validateUser(payload: CurrentUserDTO): Promise<User> {
    const user = await this.users.findOneBy({ id: payload.id });
    if(!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.users.findOneBy({ email });
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
    const registrant = await this.registrants.findOneBy({ id: registrantId });
    if(!registrant) {
      throw new HttpException(`Registrant not found`, HttpStatus.NOT_FOUND);
    }

    const existingUser = await this.users.findOneBy({ id: registrantId });
    if(existingUser) {
      throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
    }

    const user = this.users.create({ registrantId, password, email: registrant.email });
    const insertedUser = await this.users.save(user);

    console.log({ user, insertedUser });

    return this.jwtService.signAsync({ id: insertedUser.id });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.users.findOneBy({ id: userId});
    if(!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const legit = await user.comparePassword(oldPassword);

    if(!legit) {
      throw new HttpException(`Old password is invalid`, HttpStatus.UNAUTHORIZED);
    }

    user.password = newPassword;
    await user.hashPassword();
    await this.users.save(user);
  }

  async sendResetLink(email: string): Promise<void> {
    Logger.log(`Sending reset link to ${email}`);
    const user = await this.users.findOneBy({ email });
    if(!user) {
      throw new HttpException(`No user found with this email`, HttpStatus.FORBIDDEN);
    }

    const payload: ResetTokenDTO = {
      id: user.id.toString(),
      currentPassword: user.password,
      createdAt: new Date()
    };
    const resetToken = await this.jwtService.signAsync(payload);

    return this.emailService.sendEmail({
      from: `info@makeuc.io`,
      to: user.email,
      subject: `Reset your Lattice password`,
      text: `Link to reset your password: ${latticeHost}/auth/reset/${resetToken}`
    });
  }

  async getResetInfo(resetToken: string): Promise<string> {
    try {
      const payload: ResetTokenDTO = await this.jwtService.verifyAsync(resetToken);
      const user = await this.users.findOneBy({ id: payload.id });
      if(!user || (user.password !== payload.currentPassword)) {
        throw new HttpException(`This link is either invalid or expired`, HttpStatus.UNAUTHORIZED);
      }
      return user.email;
    } catch (err) {
      throw new HttpException(`Please check the link or try again later`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(resetToken: string, password: string): Promise<void> {
    const payload: ResetTokenDTO = await this.jwtService.verifyAsync(resetToken);
    const user = await this.users.findOneBy({ id: payload.id });
    if(!user) {
      throw new HttpException(`This link is either invalid or expired`, HttpStatus.UNAUTHORIZED);
    }
    user.password = password;
    await user.hashPassword();
    await this.users.save(user);
  }
}
