import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrant } from '../registration/registrant.entity';
import { GenderStat, EthnicityStat, MajorStat, SchoolStat } from './stats.dto';
import { SlackMessageService } from './slack-message.service';
import { SlashCommandDTO } from './slack-slash-command.dto';

const sortByNumber = (a, b) => b.number - a.number;

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Registrant) private registrants: Repository<Registrant>,
    private slackService: SlackMessageService
  ) {}

  async getStat(command: SlashCommandDTO): Promise<void> {
    let text = ``;
    switch(command.text) {
      case `number`:
        text = await this.getNumber();
        break;
      case `genders`:
        text = await this.getGenders();
        break;
      case `ethnicities`:
        text = await this.getEthnicities();
        break;
      case `majors`:
        text = await this.getMajors();
        break;
      case `schools`:
        text = await this.getSchools();
        break;
      case `help`:
        text = this.slackService.getHelpText();
        break;
      default:
        text = await this.getRandom();
        break;
    };
    this.slackService.sendStatMessage(command, { text });
  }

  async getRandom(): Promise<string> {
    let text = ``;
    const randomNum = Math.ceil(Math.random() * 3);
    switch(randomNum) {
      case 1:
        text = await this.getGenders();
        break;
      case 2:
        text = await this.getEthnicities();
        break;
      case 3:
        text = await this.getMajors();
        break;
    }
    return `Since you didn't tell me what you wanted to know, here is a random stat for you. ${text}`;
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
}
