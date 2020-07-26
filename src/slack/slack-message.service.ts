import { Injectable, Logger, HttpService } from '@nestjs/common';

@Injectable()
export class SlackMessageService {
  constructor(
    private http: HttpService,
  ) {}

  getHelpText(): string {
    return `
      Hello! I am MakeUC Registration Bot, but you can call me RegBot. I talk to our registration server and bring back some useful insight for you! You can think of me as your crystal ball into the 1s and 0s of the annoying BSON database called MongoDB and this stupid excuse of a programming language called Javascript.

      Here are some commands you can give me:

      \`/regbot number\`: I'll get the total number of registrants.

      \`/regbot genders\`: I'll get a breakdown of the genders of our registrants.

      \`/regbot ethnicities\`: I'll get a breakdown of the ethnicities of our registrants.

      \`/regbot majors\`: I'll get the number of different majors and show the details of the top 3.

      \`/regbot schools\`: I'll get the number of different schools and show the details of the top 3.

      \`/regbot degrees\`: I'll get a breakdown of the degree levels of our registrants.

      \`/regbot experience\`: I'll get a breakdown of the registrants' prior hackathon experience.

      \`/regbot help\`: Make me repeat myself.
    `;
  }

  sendStatMessage(url: string, text: string): void {
    this.http.post(url, { text }).subscribe({
      next() {
        Logger.log(`Successfully sent stat: ${ text }`);
      },
      error(err) {
        Logger.error(`Could not send stat response: ${err.message}`);
      }
    });
  }
}