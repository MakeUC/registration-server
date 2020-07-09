import { Injectable, Logger, HttpService } from "@nestjs/common";
import { RegistrantDTO } from "./registrant.dto";
import { QuestionDTO } from "./question-alert.dto";

@Injectable()
export class WebhookService {

  constructor(
    private http: HttpService
  ) {}

  sendQuestionWebhook(registrantDTO: RegistrantDTO): void {
    const webhookData: QuestionDTO = {
      fullName: registrantDTO.fullName,
      email: registrantDTO.email,
      question: registrantDTO.questions
    };

    this.http.post(process.env.QUESTIONS_ZAP_WEBHOOK, webhookData).subscribe({
      next: result => {
        Logger.log(`Webhook post successful for question sent by ${registrantDTO.email}: ${result.status}`)
      },
      error: err => {
        Logger.error(`Webhook post unsuccessful for question sent by ${registrantDTO.email}: ${err.message}`)
      }
    });
  }
}