import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { Registrant } from './registrant.entity';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class EmailService {
  fromAddress = `contact@makeuc.io`;

  async sendTestEmail(to: string): Promise<void> {
    const msg: sgMail.MailDataRequired = {
      to,
      from: this.fromAddress,
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
  }

  async sendVerificationEmail(registrant: Registrant): Promise<void> {
    const msg: sgMail.MailDataRequired = {
      to: registrant.email,
      from: this.fromAddress,
      subject: 'MakeUC registration',
      text: 'Confirm your email with MakeUC',
      html: `Click here to confirm your email with makeuc: <a href="${process.env.HOST}/registrant/verify/${registrant.id}" target="_blank">here</a>`
    };
    sgMail.send(msg);
  }
}
