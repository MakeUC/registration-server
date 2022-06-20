import { Controller, Get, StreamableFile, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import { join, resolve, basename } from 'path';

async function* getFiles(dir: string): string | AsyncGenerator<string, string, any> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* getFiles(res);
      } else {
        yield res;
      }
    }
  }

@Controller('/static')
export class StaticController {
  @Get(':file(*)')
  async getFile(@Param('file') file: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile | string> {
    const staticPath = join(process.cwd(), 'static');
    const files: string[] = [];

    for await (const f of getFiles(staticPath)) {
        files.push(f.substring(staticPath.length + 1));
    }

    if (!files.includes(file)) {
        res.status(404);
        return "File not found";
    }

    const filePath = join(staticPath, file);
    res.contentType(basename(filePath));

    const readFile = createReadStream(filePath);
    return new StreamableFile(readFile);
  }
}
