import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { schedule } from 'node-cron';
import { Registrant } from '../registration/registrant.entity';
import { StatCommand, getAdapter } from './service-adapter';
import { GenderStat, EthnicityStat, MajorStat, SchoolStat, DegreeStat, ExperienceStat } from './stats.dto';

const statCommands: Array<StatCommand> = [`genders`, `ethnicities`, `majors`, `schools`, `degrees`, `experience`];
const daily10PMCron = `0 0 22 * * *`;
const dailyUpdateServices = [`slack`];
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
    schedule(daily10PMCron, () => {
      Logger.log(`Sending daily stat update`);
      this.sendUpdate(dailyUpdateServices);
    });
  }

  async sendUpdate(services: Array<string>): Promise<void> {
    const text = `
      Daily registration update brought to you by the one and only, RegBot!
      ${await this.getNumber()}
      ${await this.getRandom()}
    `;
    services.forEach(async service => {
      const adapter = getAdapter(service);
      if(!adapter) {
        Logger.error(`Invalid service string found: ${service}`);
      }
      try {
        await adapter.sendMessage(text);
        Logger.log(`Daily update successfully sent to ${service}`);
      } catch(err) {
        Logger.error(`Could not send daily update to ${service}: ${err.message}`);
      }
    });
  }

  getStat(command: StatCommand): Promise<string> {
    switch(command) {
      case `number`:
        return this.getNumber();
      case `genders`:
        return this.getGenders();
      case `ethnicities`:
        return this.getEthnicities();
      case `majors`:
        return this.getMajors();
      case `schools`:
        return this.getSchools();
      case `degrees`:
        return this.getDegrees();
      case `experience`:
        return this.getExperience();
      default:
        return this.getRandom(`Since you didn't tell me what you wanted to know, I got a random stat for you. `);
    };
  }

  async getRandom(pre?: string): Promise<string> {
    const randomIndex = Math.floor(Math.random() * statCommands.length);
    const randomStatCommand = statCommands[randomIndex];
    const text = await this.getStat(randomStatCommand);

    return pre ? `${pre}${text}` : text;
  }
  
  async getNumber(): Promise<string> {
    const number = await this.registrants.count({});
    return `We have a total of ${number} registrants!`;
  }

  async getGenders(): Promise<string> {
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

    return `Here is a breakdown of the genders of registrants: ${genders.map(ge => ` ${ge.gender}: ${Math.round((ge.number / total) * 100)}%`)}`;
  }

  async getEthnicities(): Promise<string> {
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

    return `Here is a breakdown of the ethnicities of registrants: ${ethnicities.map(et => ` ${et.ethnicity}: ${Math.round((et.number / total) * 100)}%`)}`;
  }

  async getMajors(): Promise<string> {
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

    return `We have a total of ${majors.length} majors. Here are the top 3: ${first.major} (${first.number} registrants), ${second.major} (${second.number} registrants), ${third.major} (${third.number} registrants)`;
  }

  async getSchools(): Promise<string> {
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

    return `We have a registrants from a total of ${schools.length} schools. Here are the top 3: ${first.school} (${first.number} registrants), ${second.school} (${second.number} registrants), ${third.school} (${third.number} registrants)`;
  }

  async getDegrees(): Promise<string> {
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

    return `Here is a breakdown of the degrees of registrants: ${degrees.map(de => ` ${de.degree}: ${Math.round((de.number / total) * 100)}%`)}`;
  }

  async getExperience(): Promise<string> {
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

    return `Here is a breakdown of the registrants' prior hackathon experience: ${experiences.map(ex => ` ${ex.hackathonsAttended}: ${Math.round((ex.number / total) * 100)}%`)}`;
  }
}
