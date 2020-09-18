import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './currentuser.decorator';
import { LoginDTO, RegisterDTO, ResetDTO, CurrentUserDTO, ChangePasswordDTO } from './dtos';

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/email/:id')
  async getRegistrantEmail(@Param(`id`) registrantId: string): Promise<string> {
    return this.authService.getRegistrantEmail(registrantId);
  }

  @Post('/login')
  async login(@Body() credentials: LoginDTO): Promise<string> {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Post(`/register`)
  register(@Body() credentials: RegisterDTO): Promise<string> {
    return this.authService.register(credentials.registrantId, credentials.password);
  }

  @Post(`/reset`)
  reset(@Body() credentials: ResetDTO): Promise<void> {
    return this.authService.sendResetLink(credentials.email);
  }

  @Put(`/password`)
  @UseGuards(AuthGuard(`jwt`))
  changePassword(@CurrentUser() user: CurrentUserDTO, @Body() credentials: ChangePasswordDTO): Promise<void> {
    return this.authService.changePassword(user.id, credentials.oldPassword, credentials.newPassword);
  }
}
