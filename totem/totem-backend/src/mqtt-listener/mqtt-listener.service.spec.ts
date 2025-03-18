import { Test, TestingModule } from '@nestjs/testing';
import { MqttListenerService } from './mqtt-listener.service';

describe('MqttListenerService', () => {
  let service: MqttListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttListenerService],
    }).compile();

    service = module.get<MqttListenerService>(MqttListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
