import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CredentialsService } from './credentials.service';
import { Credential } from './entities/credential.entity';
import { ConfigService } from '@nestjs/config';

describe('CredentialsService', () => {
  let service: CredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        {
          provide: getRepositoryToken(Credential),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

