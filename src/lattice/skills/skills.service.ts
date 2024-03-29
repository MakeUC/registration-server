import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../skill.entity';
import { SkillDto } from './skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill) private skillsRepository: Repository<Skill>
  ) {}

  async getSkills(): Promise<Array<Skill>> {
    return this.skillsRepository.find();
  }

  private async createSkill(data: SkillDto): Promise<Skill> {
    const skill = this.skillsRepository.create(data);
    return this.skillsRepository.save(skill);
  }

  async createSkills(data: Array<SkillDto>): Promise<Array<Skill>> {
    return Promise.all(data.map(skill => this.createSkill(skill)));
  }
}
