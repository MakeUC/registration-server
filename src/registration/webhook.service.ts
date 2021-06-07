import { Injectable, Logger, HttpService } from "@nestjs/common";
import { RegistrantDTO } from "./registrant.dto";

const questionsWebhookUrl = process.env.QUESTION_WEBHOOK_URL;

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

    this.http.post(questionsWebhookUrl, { text }).subscribe({
      next: result => {
        Logger.log(`Webhook post successful for question sent by ${registrantDTO.email}: ${result.status}`)
      },
      error: err => {
        Logger.error(`Webhook post unsuccessful for question sent by ${registrantDTO.email}: ${err.message}`)
      }
    });
  }
}