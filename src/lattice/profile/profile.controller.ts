import { Controller, Get, Put, Body, UseGuards, Post, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Tour, User } from '../user.entity';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { ProfileService } from './profile.service';
import { ProfileDTO, ScoredProfileDTO, SkillDTO } from './profile.dto';
import skills from './skills';

@Controller(`profile`)
@UseGuards(AuthGuard(`jwt`))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(`/list`)
  getProfiles(@CurrentUser() user: CurrentUserDTO): Promise<Array<ScoredProfileDTO>> {
    return this.profileService.getScoredProfiles(user.id);
  }

  @Get()
  getProfile(@CurrentUser() user: CurrentUserDTO): Promise<User> {
    return this.profileService.getProfile(user.id);
  }

  @Post(`/start`)
  startProfile(@CurrentUser() user: CurrentUserDTO): Promise<void> {
    return this.profileService.startProfile(user.id);
  }

  @Put()
  updateProfile(@CurrentUser() user: CurrentUserDTO, @Body() newProfile: ProfileDTO): Promise<User> {
    return this.profileService.updateProfile(user.id, newProfile);
  }

  @Put(`/visible`)
  setVisible(@CurrentUser() user: CurrentUserDTO, @Body() body: { visible: boolean }): Promise<User> {
    return this.profileService.setVisible(user.id, body.visible);
  }

  @Get(`/skills`)
  getSkills(): Array<SkillDTO> {
    return skills;
  }

  @Post(`/tour/:tour`)
  completeTour(@CurrentUser() user: CurrentUserDTO, @Param(`tour`) tour: Tour): Promise<void> {
    return this.profileService.completeTour(user.id, tour);
  }
}
