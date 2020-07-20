export class SlashCommandDTO {
  readonly token: string
  readonly team_id: string
  readonly team_domain: string
  readonly channel_id: string
  readonly channel_name: string
  readonly user_id: string
  readonly user_name: string
  readonly command: string
  readonly text: string
  readonly response_url: string
  readonly trigger_id: string
}