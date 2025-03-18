import { Module } from '@nestjs/common';
import { MPController } from './api/controlers/mp.controller';
import { MPService } from './api/services/mp.service';
import { UtilService } from './api/services/util.service';
import { AedesService } from './api/services/aedes.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),

  ],
  controllers: [MPController],
  providers: [ MPService,UtilService , AedesService ],
})
export class AppModule {}
