import { Request } from 'express';
import { DiscordAdapter } from './discord-adapter';
import { SlackAdapter } from './slack-adapter';
import { WebAdapter } from './web-adapter';

export type StatCommand = `number` | `genders` | `ethnicities` | `majors` | `schools` | `degrees` | `experience` | `help` | `countries`;

export interface ServiceAdapter {
  helpText: string
  returnOnlyNumber: boolean

  authenticateRequest(req: Request): boolean | Promise<boolean>
  authenticateUser?(req: Request, allowed: string[]): boolean
  parseRequest(req: Request): StatCommand
  sendMessage(text: string): Promise<any>
}

export const getAdapter = (service: string): ServiceAdapter | null => {
  switch (service) {
    case `slack`:
      return SlackAdapter
    case `discord`:
      return DiscordAdapter
    case `web`:
      return WebAdapter
    default:
      return null;
  }
}