import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';

describe('RealtimeController', () => {
  let controller: RealtimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealtimeController],
      providers: [
        {
          provide: RealtimeService,
          useValue: {
            generateTicket: jest.fn().mockReturnValue('mock-ticket'),
            createStream: jest.fn(),
            removeClient: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RealtimeController>(RealtimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
