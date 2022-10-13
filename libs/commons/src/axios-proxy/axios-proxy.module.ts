import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosProxyService } from './axios-proxy.service';
import { HttpsProxyAgent } from 'hpagent';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'env.example'],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const proxyProtocol = configService.get<string>(
          `PROXY_PROTOCOL`,
          'http',
        );
        const proxyServer = configService.get<string>(
          `PROXY_SERVER`,
          undefined,
        );
        const proxyPort = Number(configService.get<number>(`PROXY_PORT`, 8080));
        const proxyUser = configService.get<string>(`PROXY_USER`, '');
        const proxyPass = configService.get<string>(`PROXY_PASS`, '');
        const proxy = `${proxyProtocol}://${proxyUser}:${proxyPass}@${proxyServer}:${proxyPort}`;

        return {
          timeout: configService.get('HTTP_TIMEOUT'),
          maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
          httpsAgent: new HttpsProxyAgent({
            proxy,
            rejectUnauthorized: false,
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AxiosProxyService],
})
export class AxiosProxyModule {}
