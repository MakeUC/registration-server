/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { schedule } from 'node-cron';
import { Registrant } from '../registration/registrant.entity';
import { StatCommand, getAdapter } from './service-adapter';
import { GenderStat, EthnicityStat, MajorStat, SchoolStat, DegreeStat, ExperienceStat, CountryStat } from './stats.dto';

const statCommands: Array<StatCommand> = [`genders`, `ethnicities`, `majors`, `schools`, `degrees`, `experience`, `countries`];
const dailyCron = `0 0 22 * * *`;
const dailyUpdateServices = [`discord`];
const sortByNumber = (a, b) => b.number - a.number;

@Injectable()
export class StatsService implements OnModuleInit {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
  ) {}

  onModuleInit(): void {
    this.scheduleUpdate();
  }

  scheduleUpdate(): void {
    schedule(dailyCron, () => {
      Logger.log(`Sending daily stat update`);
      this.sendUpdate(dailyUpdateServices);
    });
  }

  async sendUpdate(services: Array<string>): Promise<void> {
    const text = `
      Daily registration update brought to you by the one and only, MakeIt!
      ${await this.getRandom()}
    `;
    services.forEach(async service => {
      const adapter = getAdapter(service);
      if(!adapter) {
        Logger.error(`Invalid service string found: ${service}`);
        return;
      }
      try {
        await adapter.sendMessage(text);
        Logger.log(`Daily update successfully sent to ${service}`);
      } catch(err) {
        Logger.error(`Could not send daily update to ${service}: ${err.message}`);
      }
    });
  }

  getStat(command: StatCommand, returnOnlyNumber: boolean): Promise<string | number> {
    switch(command) {
      case `number`:
        return this.getNumber(returnOnlyNumber);
      case `genders`:
        return this.getGenders(returnOnlyNumber);
      case `ethnicities`:
        return this.getEthnicities(returnOnlyNumber);
      case `majors`:
        return this.getMajors(returnOnlyNumber);
      case `schools`:
        return this.getSchools(returnOnlyNumber);
      case `degrees`:
        return this.getDegrees(returnOnlyNumber);
      case `experience`:
        return this.getExperience(returnOnlyNumber);
      case `countries`:
        return this.getCountries(returnOnlyNumber);
      default:
        return this.getRandom(returnOnlyNumber, `Since you didn't tell me what you wanted to know, I got a random stat for you. `);
    };
  }

  async getRandom(returnOnlyNumber = false, pre?: string): Promise<string> {
    const randomIndex = Math.floor(Math.random() * statCommands.length);
    const randomStatCommand = statCommands[randomIndex];
    const text = await this.getStat(randomStatCommand, returnOnlyNumber) as string;

    return pre ? `${pre}${text}` : text;
  }

  async getNumber(returnOnlyNumber = false): Promise<string | number> {
    const number = await this.registrants.count();
    return returnOnlyNumber ? number : `We have a total of ${number} participants!`;
  }

  async getGenders(returnOnlyNumber = false): Promise<string> {
    const allRegistrants = await this.registrants.find();
    const genders: GenderStat[] = [];
    allRegistrants.forEach(registrant => {
      const genderStat = genders.find(({ gender }) => gender === registrant.gender);
      if(genderStat) {
        genderStat.number++
      } else {
        genders.push({ gender: registrant.gender, number: 1 });
      }
    });

    const total = await this.registrants.count();

    return `Here is a breakdown of the genders of registrants: ${genders.map(ge => `
      ${ge.gender}: ${Math.round((ge.number / total) * 100)}%`
    )}`;
  }

  async getEthnicities(returnOnlyNumber = false): Promise<string> {
    const allRegistrants = await this.registrants.find();
    const ethnicities: EthnicityStat[] = [];
    allRegistrants.forEach(registrant => {
      const etnicityStat = ethnicities.find(({ ethnicity }) => ethnicity === registrant.ethnicity);
      if(etnicityStat) {
        etnicityStat.number++
      } else {
        ethnicities.push({ ethnicity: registrant.ethnicity, number: 1 });
      }
    });

    const total = await this.registrants.count();

    return `Here is a breakdown of the ethnicities of registrants: ${ethnicities.map(et => `
      ${et.ethnicity}: ${Math.round((et.number / total) * 100)}%`
    )}`;
  }

  async getMajors(returnOnlyNumber = false): Promise<string | number> {
    const allRegistrants = await this.registrants.find();
    const majors: MajorStat[] = [];
    allRegistrants.forEach(registrant => {
      const majorStat = majors.find(({ major }) => major === registrant.major);
      if(majorStat) {
        majorStat.number++
      } else {
        majors.push({ major: registrant.major, number: 1 });
      }
    });

    majors.sort(sortByNumber);

    const [ first, second, third ] = majors;

    return returnOnlyNumber ? majors.length : `We have a total of ${majors.length} majors. Here are the top 3:
      ${first.major} (${first.number} registrants),
      ${second.major} (${second.number} registrants),
      ${third.major} (${third.number} registrants)`;
  }

  async getSchools(returnOnlyNumber = false): Promise<string | number> {
    const allRegistrants = await this.registrants.find();
    const schools: SchoolStat[] = [];
    allRegistrants.forEach(registrant => {
      const schoolStat = schools.find(({ school }) => school === registrant.school);
      if(schoolStat) {
        schoolStat.number++
      } else {
        schools.push({ school: registrant.school, number: 1 });
      }
    });

    schools.sort(sortByNumber);

    const [ first, second, third ] = schools;

    return returnOnlyNumber ? schools.length : `We have a registrants from a total of ${schools.length} schools. Here are the top 3:
      ${first.school} (${first.number} registrants),
      ${second.school} (${second.number} registrants),
      ${third.school} (${third.number} registrants)`;
  }

  async getDegrees(returnOnlyNumber = false): Promise<string> {
    const allRegistrants = await this.registrants.find();
    const degrees: DegreeStat[] = [];
    allRegistrants.forEach(registrant => {
      const degreeStat = degrees.find(({ degree }) => degree === registrant.degree);
      if(degreeStat) {
        degreeStat.number++
      } else {
        degrees.push({ degree: registrant.degree, number: 1 });
      }
    });

    const total = await this.registrants.count();

    return `Here is a breakdown of the degrees of registrants: ${degrees.map(de => `
      ${de.degree}: ${Math.round((de.number / total) * 100)}%`
    )}`;
  }

  async getExperience(returnOnlyNumber = false): Promise<string> {
    const allRegistrants = await this.registrants.find();
    const experiences: ExperienceStat[] = [];
    allRegistrants.forEach(registrant => {
      const experienceStat = experiences.find(({ hackathonsAttended }) => hackathonsAttended === registrant.hackathonsAttended);
      if(experienceStat) {
        experienceStat.number++
      } else {
        experiences.push({ hackathonsAttended: registrant.hackathonsAttended, number: 1 });
      }
    });

    const total = await this.registrants.count();

    return `Here is a breakdown of the registrants' prior hackathon experience: ${experiences.map(ex => `
      ${ex.hackathonsAttended}: ${Math.round((ex.number / total) * 100)}%`
    )}`;
  }

  async getCountries(returnOnlyNumber = false): Promise<string | number> {
    const allRegistrants = await this.registrants.find();
    const countries: CountryStat[] = [];
    allRegistrants.forEach(registrant => {
      const countryStat = countries.find(({ country }) => country === registrant.country);
      if(countryStat) {
        countryStat.number++
      } else {
        countries.push({ country: registrant.country, number: 1 });
      }
    });

    countries.sort(sortByNumber);

    const [ first, second, third ] = countries;

    return returnOnlyNumber ? countries.length : `We have a registrants from a total of ${countries.length} countries. Here are the top 3:
      ${first.country} (${first.number} registrants),
      ${second.country} (${second.number} registrants),
      ${third.country} (${third.number} registrants)`;
  }
}
