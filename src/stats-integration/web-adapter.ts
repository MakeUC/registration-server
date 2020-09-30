import { Request } from 'express';
import { ServiceAdapter, StatCommand } from './service-adapter';

export const WebAdapter: ServiceAdapter = {
  helpText: ``,
  returnOnlyNumber: true,
	authenticateRequest(): boolean {
		return true;
	},
	parseRequest(req: Request): StatCommand {
		return req.body.text;
	},
	sendMessage() {
		return Promise.resolve();
	}
}