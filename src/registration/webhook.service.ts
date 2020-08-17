import { Injectable, Logger, HttpService } from "@nestjs/common";
import { RegistrantDTO } from "./registrant.dto";

const slackQuestionsWebhookUrl = process.env.SLACK_QUESTION_WEBHOOK_URL;

@Injectable()
export class WebhookService {
  constructor(
    private http: HttpService
  ) {}

  sendQuestionWebhook(registrantDTO: RegistrantDTO): void {
    const text = `
      Question by ${registrantDTO.fullName} (${registrantDTO.email}):
      ${registrantDTO.questions}
    `;

    this.http.post(slackQuestionsWebhookUrl, { text }).subscribe({
      next: result => {
        Logger.log(`Webhook post successful for question sent by ${registrantDTO.email}: ${result.status}`)
      },
      error: err => {
        Logger.error(`Webhook post unsuccessful for question sent by ${registrantDTO.email}: ${err.message}`)
      }
    });
  }
}