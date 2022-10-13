import { Test, TestingModule } from '@nestjs/testing';
import { AxiosProxyService } from './axios-proxy.service';

describe('AxiosProxyService', () => {
  let service: AxiosProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AxiosProxyService],
    }).compile();

    service = module.get<AxiosProxyService>(AxiosProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
