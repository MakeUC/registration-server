import { readFile } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import Handlebars from 'handlebars';
import { Registrant } from './registrant.entity';
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages';

const mailgunApiKey = process.env.MAILGUN_API_KEY!;
const mailgunDomain = process.env.MAILGUN_DOMAIN!;
const serverHost = process.env.HOST!;
const siteUrl = process.env.WEBSITE_URL!;
const staticUrl = process.env.STATIC_URL!;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: mailgunApiKey});

@Injectable()
export class EmailService {
  fromAddress = `info@makeuc.io`;

  verificationTemplate: HandlebarsTemplateDelegate<{ fullName: string, verificationUrl: string, staticUrl: string }>;

  welcomeTemplate: HandlebarsTemplateDelegate<{ fullName: string, claimUrl: string, staticUrl: string }>;

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

    mg.messages
        .create(mailgunDomain, {
            to: registrant.email,
            from: this.fromAddress,
            subject: 'MakeUC Registration',
            text: 'Confirm Your Email with MakeUC',
            html: this.verificationTemplate({ fullName, verificationUrl, staticUrl }),
        })
        .then((msg) => {
            Logger.log(`Message from MailGun: ${msg}`)
            Logger.log(`Verification email sent to ${registrant.email} successfully`);
        })
        .catch(err => {

            Logger.error(`Verification email could not be sent to ${registrant.email}: ${err.message}`);
        })
  }

  async sendWelcomeEmail(registrant: Registrant): Promise<void> {
    const fullName = registrant.fullName;
    const claimUrl = `${siteUrl}/claim`;

    if(!this.welcomeTemplate) {
      return Logger.error(`Welcome email template not found`);
    }
    
    mg.messages
        .create(mailgunDomain, {
            to: registrant.email,
            from: this.fromAddress,
            subject: 'MakeUC Registration',
            text: 'Thank you for registering to MakeUC 2021',
            html: this.welcomeTemplate({ fullName, claimUrl, staticUrl }),
        })
        .then((msg) => {
            Logger.log(`Message from MailGun: ${msg}`)
            Logger.log(`Welcome email sent to ${registrant.email} successfully`);
        }).catch(err => {
            Logger.error(`Welcome email could not be sent to ${registrant.email}: ${err.message}`);
        });
  }

  async sendEmail(msg: MailgunMessageData): Promise<void> {
    await mg.messages.create(mailgunDomain, msg);
  }
}
