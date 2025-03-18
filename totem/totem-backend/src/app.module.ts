import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { MqttListenerService } from './mqtt-listener/mqtt-listener.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DATABASE,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production', // Desactivar en producción
          }),          
        AuthModule,
        APIModule,    
    ],
    providers: [MqttListenerService]
})
export class AppModule { }





