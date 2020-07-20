export class StatsDTO {
  readonly number?: number
  readonly genders?: Array<GenderStat>
  readonly ethnicities?: Array<EthnicityStat>
}

export type GenderStat = { gender: string, number?: number }

export type EthnicityStat = { ethnicity: string, number?: number }

export type MajorStat = { major: string, number?: number }

export type SchoolStat = { school: string, number?: number }