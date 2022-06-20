import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { ObjectID } from 'mongodb';
import { Swipe } from '../swipe.entity';
import { ScoreService } from './score.service';
import { ProfileDTO, ScoredProfileDTO } from './profile.dto';
import { User, Tour } from '../user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Swipe) private matches: Repository<Swipe>,
    private scoreService: ScoreService
  ) {}

  private async getMatches(from: User): Promise<Array<Swipe>> {
    return this.matches.findBy({ from: from.id.toString() });
  }

  private async getUnscoredProfiles(from: User): Promise<Array<User>> {
    const matches = await this.getMatches(from);
    const matchedUsers = matches.map(match => new ObjectID(match.to));

    return this.users.findBy({
      visible: true,
      id: Not(In([ ...matchedUsers, from.id ]))
    });
  }

  async getScoredProfiles(fromId: string): Promise<Array<ScoredProfileDTO>> {
    const from = await this.users.findOneBy({ id: fromId });
    if(!from?.visible) {
      throw new HttpException(`Profile must be visible`, HttpStatus.UNAUTHORIZED);
    }

    const unscoredProfiles = await this.getUnscoredProfiles(from);
    const scoredProfiles = this.scoreService.scoreAndSortProfiles(from, unscoredProfiles);
    scoredProfiles.splice(10);
    return scoredProfiles.reverse();
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.users.findOneBy({id});

    if(!user) {
      Logger.error(`User ${id} not found`);
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async startProfile(id: string): Promise<void> {
    const profile = await this.users.findOneBy({id});
    if(!profile || profile?.started) {
      throw new HttpException(`Profile already started`, HttpStatus.BAD_REQUEST);
    }

    profile.started = true;
    await this.users.save(profile);
  }

  async updateProfile(id: string, updates: ProfileDTO): Promise<User> {
    const profile = await this.users.findOneBy({id});
    if(!profile) {
      Logger.error(`User ${id} not found`);
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const newProfile: User = Object.assign(profile, updates);

    try {
      await validateOrReject(newProfile);
    } catch(err) {
      Logger.error(`Validation error`);
      Logger.error(err);
      throw new HttpException(`Invalid profile fields`, HttpStatus.BAD_REQUEST);
    }

    if(!newProfile.completed) {
      newProfile.completed = true;
    }
    
    try {
      await this.users.save(newProfile);
    } catch (err) {
      Logger.error(err);
      throw new HttpException(`Error updating user profile: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.getProfile(id);
  }

  async setVisible(id: string, visible: boolean): Promise<User> {
    const profile = await this.users.findOneBy({id});
    if(!profile) {
      Logger.error(`User ${id} not found`);
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
    profile.visible = !!visible;
    return this.users.save(profile);
  }

  async completeTour(id: string, tour: Tour): Promise<void> {
    const profile = await this.users.findOneBy({id});

    if(!profile) {
      Logger.error(`User ${id} not found`);
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    if(!profile.completedTours) {
      profile.completedTours = [];
    }

    if(profile.completedTours.includes(tour)) {
      return;
    }

    profile.completedTours.push(tour);
    await this.users.save(profile);
  }
}
