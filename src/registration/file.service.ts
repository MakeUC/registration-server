import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { Registrant } from "./registrant.entity";

const s3 = new S3();

@Injectable()
export class FileService {
  bucketName = `makeuc-2020-resumes`;
  
  async uploadResume(file: File, registrant: Registrant): Promise<string> {
    const upload = await s3.upload({ Bucket: this.bucketName, Key: `${registrant.email}-resume`, Body: file }).promise();
    return upload.Location;
  }
}