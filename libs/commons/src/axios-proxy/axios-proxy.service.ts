import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, tap } from 'rxjs';

@Injectable()
export class AxiosProxyService implements OnModuleInit {
  private readonly logger = new Logger(AxiosProxyService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    const proxyProtocol = this.configService.get<string>(
      `PROXY_PROTOCOL`,
      'http',
    );
    const proxyServer = this.configService.get<string>(
      `PROXY_SERVER`,
      undefined,
    );
    const proxyPort = Number(
      this.configService.get<number>(`PROXY_PORT`, 8080),
    );
    const proxyUser = this.configService.get<string>(`PROXY_USER`, '');
    const proxyPass = this.configService.get<string>(`PROXY_PASS`, '');
    const proxy = `${proxyProtocol}://${proxyUser}:${proxyPass}@${proxyServer}:${proxyPort}`;

    this.logger.debug(`Use proxy ${proxy}`);

    return this.httpService
      .get(`https://checker.soax.com/api/ipinfo`)
      .pipe(
        map((res) => res.data),
        tap((data) =>
          this.logger.debug(
            `Your ip is ${data?.data?.ip} (${data?.data?.isp}) with ip proxy ${proxy}`,
          ),
        ),
      )
      .subscribe();
  }
}
