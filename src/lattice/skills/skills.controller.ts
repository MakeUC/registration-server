import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SkillsService } from './skills.service';
import { SkillDto } from './skill.dto';
import { Skill } from '../skill.entity';

@Controller(`skills`)
@UseGuards(AuthGuard(`jwt`))
export class SkillsController {
  constructor(private readonly matchService: SkillsService) {}

  @Get()
  getSkills(): Promise<Array<Skill>> {
    return this.matchService.getSkills();
  }

  @Post()
  createSkills(@Body() data: Array<SkillDto>): Promise<Array<Skill>> {
    return this.matchService.createSkills(data);
  }
}
