import { Request } from 'express';
import { SlackAdapter } from './slack-adapter';
import { WebAdapter } from './web-adapter';

export type StatCommand = `number` | `genders` | `ethnicities` | `majors` | `schools` | `degrees` | `experience` | `help` | `countries`;

export interface ServiceAdapter {
  helpText: string
  returnOnlyNumber: boolean

  authenticateRequest(req: Request): boolean | Promise<boolean>
  parseRequest(req: Request): StatCommand
  sendMessage(text: string): Promise<any>
}

export const getAdapter = (service: string): ServiceAdapter => {
  switch (service) {
    case `slack`:
      return SlackAdapter
    case `web`:
      return WebAdapter
    default:
      return null;
  }
}