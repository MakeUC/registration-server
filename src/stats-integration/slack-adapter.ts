import { createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';
import { stringify } from 'querystring';
import Axios from 'axios';
import { ServiceAdapter, StatCommand } from './service-adapter';

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackUpdateWebhookUrl = process.env.SLACK_UPDATE_WEBHOOK_URL;

const fixedEncodeURIComponent = (str: string) =>
  str.replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

export const SlackAdapter: ServiceAdapter = {
	helpText: `
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
	`,
	authenticateRequest(req: Request): boolean {
		const timestamp = req.get(`X-Slack-Request-Timestamp`);
		const signature = req.get(`X-Slack-Signature`);
		const body = stringify(req.body).replace(/%20/g, '+');
		const payload = fixedEncodeURIComponent(body);

		const hmacDigest = createHmac(`sha256`, slackSigningSecret)
			.update(`v0:${timestamp}:${payload}`)
			.digest(`hex`);

		const hash = `v0=${hmacDigest}`;
	
		return timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(hash, 'utf8'));
	},
	authenticateUser(req: Request, allowed: string[]): boolean {
		const userId = req.body.user_id;
		return allowed.includes(userId);
	},
	parseRequest(req: Request): StatCommand {
		return req.body.text;
	},
	sendMessage(text: string) {
		return Axios.post(slackUpdateWebhookUrl, { text });
	}
}