import { Test, TestingModule } from '@nestjs/testing';
import { MailLogsService } from './mail-logs.service';

describe('MailLogsService', () => {
  let service: MailLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailLogsService],
    }).compile();

    service = module.get<MailLogsService>(MailLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
