import { Test, TestingModule } from '@nestjs/testing';
import { MailLogsController } from './mail-logs.controller';
import { MailLogsService } from './mail-logs.service';

describe('MailLogsController', () => {
  let controller: MailLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailLogsController],
      providers: [MailLogsService],
    }).compile();

    controller = module.get<MailLogsController>(MailLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
