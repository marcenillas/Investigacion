import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from '../../common/helpers/image.helper';

import { ImageService } from '../services/image.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly configService: ConfigService,
    ) { }

    @Get(':imageName')
    findProductImage(
        @Res() res: Response,
        @Param('imageName') imageName: string
    ) {

        const path = this.imageService.getImage(imageName);

        res.sendFile(path);
    }

    @Post('product')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFilter,
        storage: diskStorage({
            destination: './static',
            filename: fileNamer
        })
    }))
    uploadProductImage(
        @UploadedFile() file: Express.Multer.File,
    ) {

        if (!file) {
            throw new BadRequestException('Make sure that the file is an image');
        }

        const secureUrl = `${this.configService.get('HOST_API')}/image/${file.filename}`;

        return { secureUrl };
    }
}