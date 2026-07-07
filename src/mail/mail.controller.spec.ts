import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { EmailTokenGuard } from './guards/email-token.guard';
import { AuthGuard } from '../auth/auth.guard';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: {
            sendEmail: jest.fn(),
            findAllLogs: jest.fn(),
            findLogById: jest.fn(),
            removeLog: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(EmailTokenGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

