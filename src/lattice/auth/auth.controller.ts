import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, ResetDTO } from './dtos';

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
}
