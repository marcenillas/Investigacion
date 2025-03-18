import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();  // Cargar las variables de entorno

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    const logger = new Logger('Bootstrap');

    const siteName = process.env.SITE_NAME 

    const apiPrefix = siteName ? `${siteName}/api` : 'api'; 

    app.setGlobalPrefix(apiPrefix);

    const config = new DocumentBuilder()
        .setTitle('SIELCON Pay - Admin')
        .setVersion('1.0-beta')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(apiPrefix, app, document);

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            }
        })
    );

    await app.listen(process.env.HOST_PORT);
    logger.log(`App running on port ${process.env.HOST_PORT}`);
}
bootstrap();
