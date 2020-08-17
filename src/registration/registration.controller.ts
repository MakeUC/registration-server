import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, Redirect } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegistrationService } from './registrant.service';
import { RegistrantDTO } from './registrant.dto';
import { Registrant } from './registrant.entity';

const websiteHost = process.env.WEBSITE_URL;

@Controller(`registrant`)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  register(@Body() newRegistrant: RegistrantDTO, @UploadedFile() resume: Express.Multer.File): Promise<Registrant> {
    return this.registrationService.register(newRegistrant, resume);
  }

  @Get(`/verify/:id`)
  @Redirect(`${websiteHost}/verified`)
  async verify(@Param(`id`) id: string): Promise<{ url: string }> {
    const verified = await this.registrationService.verify(id);
    if(!verified) {
      return { url: `${websiteHost}/already-verified` };
    }
  }
}
