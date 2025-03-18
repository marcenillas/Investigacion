import { existsSync } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageService {

    getImage(imageName: string) {

        const path = join(__dirname, '../../static/images', imageName);

        if (!existsSync(path))
            throw new BadRequestException(`No image found with name ${imageName}`);

        return path;
    }
}