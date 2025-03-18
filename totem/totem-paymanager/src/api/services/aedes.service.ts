import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
const aedes = require('aedes')();
const net = require('net');

@Injectable()
export class AedesService implements OnModuleInit, OnModuleDestroy {
  private server: any;
  private readonly port = 1883;
  private readonly logger = new Logger('AedesService');

  async onModuleInit() {
    this.server = net.createServer(aedes.handle);

    this.server.listen(this.port, () => {
      this.logger.debug(`Broker AEDES iniciado en el puerto ${this.port}`);
      aedes.on('client', (client: { id: number }) => {
        this.logger.debug(`Cliente conectado: ${client.id}`);
      });
      aedes.on('clientDisconnect', (client: { id: number }) => {
        this.logger.warn(`Cliente desconectado: ${client.id}`);
      });
    });
  }

  onModuleDestroy() {
    this.server.close(() => {
      this.logger.log('Broker AEDES ha sido cerrado');
    });
  }
}
