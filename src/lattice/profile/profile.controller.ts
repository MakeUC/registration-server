import { Controller, Get, Put, Body, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user.entity';
import { CurrentUserDTO } from '../auth/dtos';
import { CurrentUser } from '../auth/currentuser.decorator';
import { ProfileService } from './profile.service';
import { ProfileDTO, ScoredProfileDTO } from './profile.dto';

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
    try {
      console.log({ body });
      return this.profileService.setVisible(user.id, body.visible);
    } catch (error) {
      console.error(error)
    }
  }
}
