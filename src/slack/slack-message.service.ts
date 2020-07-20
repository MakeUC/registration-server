import { Injectable, Logger, HttpService } from "@nestjs/common";
import { SlashCommandDTO } from "./slack-slash-command.dto";

@Injectable()
export class SlackMessageService {

  constructor(
    private http: HttpService
  ) {}

  getHelpText(): string {
    return `
      Hello! I am MakeUC Registration Bot. I talk to our registration server and bring back some useful insight for you! You can think of me as your crystal ball into the 1s and 0s of the annoying BSON database called MongoDB and this stupid excuse of a programming language called Javascript.

      Here are some commands you can give me:

      \`/regbot number\`: I'll get the total number of registrants.

      \`/regbot genders\`: I'll get a breakdown of the genders of our registrants.

      \`/regbot ethnicities\`: I'll get a breakdown of the ethnicities of our registrants.

      \`/regbot majors\`: I'll get the number of different majors and show the details of the top 3.

      \`/regbot schools\`: I'll get the number of different schools and show the details of the top 3.

      \`/regbot help\`: Make me repeat myself.
    `;
  }

  sendStatMessage(command: SlashCommandDTO, data: { text: string }): void {
    this.http.post(command.response_url, data).subscribe({
      next() {
        Logger.log(`Successfully returned stat: ${command.text}`);
      },
      error(err) {
        Logger.error(`Could not send stat response: ${err.message}`);
      }
    });
  }
}