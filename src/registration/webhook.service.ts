import { Injectable, Logger, HttpService } from "@nestjs/common";
import { RegistrantDTO } from "./registrant.dto";

const questionsWebhookUrl = process.env.QUESTION_WEBHOOK_URL!;
const DISCORD_BOT_SERVER_KEY = process.env.DISCORD_BOT_SERVER_KEY!;

@Injectable()
export class WebhookService {
  constructor(
    private http: HttpService
  ) {}

  sendQuestionWebhook(registrantDTO: RegistrantDTO): void {
    const message = `
      Question by ${registrantDTO.fullName} (${registrantDTO.email}):
      ${registrantDTO.questions}
    `;

    this.http.post(
      questionsWebhookUrl,
      { message },
      { headers: { Authorization: `Bearer ${DISCORD_BOT_SERVER_KEY}` } }
    ).subscribe({
      next: result => {
        Logger.log(`Webhook post successful for question sent by ${registrantDTO.email}: ${result.status}`)
      },
      error: err => {
        Logger.error(`Webhook post unsuccessful for question sent by ${registrantDTO.email}: ${err.message}`)
      }
    });
  }
}