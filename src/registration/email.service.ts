import { readFile } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import Handlebars from 'handlebars';
import { Registrant } from './registrant.entity';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const serverHost = process.env.HOST;
const siteUrl = process.env.WEBSITE_URL;

sgMail.setApiKey(sendgridApiKey);

@Injectable()
export class EmailService {
  fromAddress = `info@makeuc.io`;

  verificationTemplate: HandlebarsTemplateDelegate<{ fullName: string, verificationUrl: string }>;

  welcomeTemplate: HandlebarsTemplateDelegate<{ fullName: string, claimUrl: string }>;

  constructor() {
    this.getverificationEmailTemplate();
    this.getWelcomeEmailTemplate();
  }

  getverificationEmailTemplate(): void {
    readFile(`${__dirname}/../../templates/verification.html`, (err, data) => {
      if(err) Logger.error(err);
      if(!data) Logger.error(new Error(`Verification email template not found`));

      this.verificationTemplate = Handlebars.compile(data.toString())
    });
  }

  getWelcomeEmailTemplate(): void {
    readFile(`${__dirname}/../../templates/welcome.html`, (err, data) => {
      if(err) Logger.error(err);
      if(!data) Logger.error(new Error(`Welcome email template not found`));

      this.welcomeTemplate = Handlebars.compile(data.toString())
    });
  }

  async sendVerificationEmail(registrant: Registrant): Promise<void> {
    const fullName = registrant.fullName;
    const verificationUrl = `${serverHost}/registrant/verify/${registrant.id}`;

    if(!this.verificationTemplate) {
      return Logger.error(`Verification email template not found`);
    }

    const msg: sgMail.MailDataRequired = {
      to: registrant.email,
      from: this.fromAddress,
      subject: 'MakeUC Registration',
      text: 'Confirm Your Email with MakeUC',
      html: this.verificationTemplate({ fullName, verificationUrl })
    };

    sgMail.send(msg).then(() => {
      Logger.log(`Verification email sent to ${registrant.email} successfully`);
    }).catch(err => {
      Logger.error(`Verification email could not be sent to ${registrant.email}: ${err.message}`);
    });
  }

  async sendWelcomeEmail(registrant: Registrant): Promise<void> {
    const fullName = registrant.fullName;
    const claimUrl = `${siteUrl}/claim`;

    if(!this.welcomeTemplate) {
      return Logger.error(`Welcome email template not found`);
    }

    const msg: sgMail.MailDataRequired = {
      to: registrant.email,
      from: this.fromAddress,
      subject: 'MakeUC Registration',
      text: 'Thank you for registering to MakeUC 2021',
      html: this.welcomeTemplate({ fullName, claimUrl })
    };

    sgMail.send(msg).then(() => {
      Logger.log(`Welcome email sent to ${registrant.email} successfully`);
    }).catch(err => {
      Logger.error(`Welcome email could not be sent to ${registrant.email}: ${err.message}`);
    });
  }

  async sendEmail(msg: sgMail.MailDataRequired): Promise<void> {
    await sgMail.send(msg);
  }
}
