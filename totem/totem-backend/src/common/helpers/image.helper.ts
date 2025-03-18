import { v4 as uuid } from 'uuid'
import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException } from '@nestjs/common';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null, fileName);
}

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png'];

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true)
    }

    callback(null, false);
}

export const getImage = (imageName: string) => {

    const path = join(__dirname, '../../static/images', imageName);

    if (!existsSync(path))
        throw new BadRequestException(`No image found with name ${imageName}`);

    return path;
}