import { Request } from 'express';
import Axios from 'axios';
import { ServiceAdapter, StatCommand } from './service-adapter';

const STATS_KEY = process.env.STATS_KEY!;
const DISCORD_BOT_SERVER_KEY = process.env.DISCORD_BOT_SERVER_KEY!;
const DISCORD_MESSAGE_URL = process.env.DISCORD_MESSAGE_URL!;

export const DiscordAdapter: ServiceAdapter = {
  helpText: `
Here are some stats about MakeUC2021 I can get for you:
\`!stats number\`: I'll get the total number of registrants.
\`!stats genders\`: I'll get a breakdown of the genders of our registrants.
\`!stats ethnicities\`: I'll get a breakdown of the ethnicities of our registrants.
\`!stats majors\`: I'll get the number of different majors and show the details of the top 3.
\`!stats schools\`: I'll get the number of different schools and show the details of the top 3.
\`!stats degrees\`: I'll get a breakdown of the degree levels of our registrants.
\`!stats experience\`: I'll get a breakdown of the registrants' prior hackathon experience.
\`!stats countries\`: I'll get a breakdown of the registrants' countries.
\`!stats\`: I'll get a random stat from one of the above options.
\`!stats help\`: Make me repeat myself.
	`,
	returnOnlyNumber: false,
	authenticateRequest(req: Request): boolean {
    const token = req.headers.authorization!.split(' ')[1]
    return token === STATS_KEY;
	},
	authenticateUser(req: Request, allowed: string[]): boolean {
		const userId = req.body.user_id;
		return allowed.includes(userId);
	},
	parseRequest(req: Request): StatCommand {
		return req.body.text;
	},
	sendMessage(message: string) {
		return Axios.post(DISCORD_MESSAGE_URL, { message }, {
      headers: { Authorization: `Bearer ${DISCORD_BOT_SERVER_KEY}` }
    });
	}
}