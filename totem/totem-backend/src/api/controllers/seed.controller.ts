import { Controller, Get, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from '../services/seed.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {

    constructor(private readonly s: SeedService) { }

    @Get() execute() { return this.s.execute() }



    @Post('process')
    @ApiOperation({ summary: 'Process migration file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'The file has been processed successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './db',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }))
    async processFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
      if (!file) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
      }
  
      try {
        await this.s.processMigrationFile(file.path);
      } catch (error) {
        throw new HttpException('Error processing file', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }













    
}