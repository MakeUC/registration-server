import { Request } from 'express';
import { SlackAdapter } from './slack-adapter';

export type StatCommand = `number` | `genders` | `ethnicities` | `majors` | `schools` | `degrees` | `experience` | `help`;

export interface ServiceAdapter {
  helpText: string
  authenticateRequest(req: Request): boolean | Promise<boolean>
  authenticateUser?(req: Request, allowed: string[]): boolean
  parseRequest(req: Request): StatCommand
  sendMessage(text: string): Promise<any>
}

export const getAdapter = (service: string): ServiceAdapter => {
  switch (service) {
    case `slack`:
      return SlackAdapter
    default:
      return null;
  }
}