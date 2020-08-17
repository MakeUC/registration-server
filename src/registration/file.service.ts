import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { Registrant } from "./registrant.entity";

const Bucket = process.env.AWS_S3_BUCKET;

const s3 = new S3();

@Injectable()
export class FileService {
  constructor() {
    s3.createBucket({ Bucket }, (err, res) => {
      if(err) {
        return Logger.error(`Error creating S3 bucket: ${err}`);
      }
      Logger.log(`Successfully created bucket: ${res.Location}`);
    });
  }
  
  async uploadResume(file: Express.Multer.File, registrant: Registrant): Promise<string> {
    try {
      const upload = await s3
        .upload({ Bucket, Key: `${registrant.email}-resume.pdf`, Body: file.buffer })
        .promise();

      return upload.Location;
    } catch (err) {
      Logger.error(`Error uploading file to S3: ${err.message}`);
      throw new HttpException(`Error uploading file to S3: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}