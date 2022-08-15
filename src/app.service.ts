import { PlaywrightService } from '@libs/commons/playwright/playwright.service';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Page } from 'playwright';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly playwright: PlaywrightService,
  ) {}

  async onApplicationBootstrap() {
    const url = 'https://hanivan.my.id';
    const pattern =
      '//section/p[@class="hidden lg:block" and normalize-space()]';
    let page: Page = await this.playwright.createPage();

    this.logger.log(`Start scrape from ${url}`);
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.timeout,
      });
      const res = await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes('github') && res.status() === 200,
        ),
      ]);

      if (res[0].status() === 200) {
        const node = await page.$(`xpath=${pattern}`);
        if (node && !page.isClosed()) {
          console.log(await node.innerText());
        }
      }
    } catch (error) {
      if (page && !page.isClosed()) {
        await page.close();
      }
      throw error;
    }
  }

  get timeout() {
    return Number(this.config.get<string>('BROWSER_TIMEOUT', '30000'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
