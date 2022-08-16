import { PlaywrightService } from '@libs/commons/playwright/playwright.service';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElementHandle, Page } from 'playwright';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private logger = new Logger(AppService.name);
  private waitAfterConnectedInSec = 5;

  constructor(
    private readonly config: ConfigService,
    private readonly playwright: PlaywrightService,
  ) {}

  async onApplicationBootstrap() {
    const url = 'https://hanivan.my.id';
    const containerPattern = 'xpath=//section';
    const contentPattern =
      './p[@class="hidden lg:block"]/text()[normalize-space()]';
    const page: Page = await this.playwright.createPage();

    this.logger.log(`Start scrape from ${url}`);
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.timeout,
      });
      this.logger.debug(
        `wait for ${
          this.waitAfterConnectedInSec
        }s after success load ${page.url()}`,
      );
      const res = await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes('github') && res.status() === 200,
        ),
      ]);
      await new Promise((res) =>
        setTimeout(res, this.waitAfterConnectedInSec * 1000),
      );

      if (res[0].status() === 200) {
        const containers = await page.$$(containerPattern);

        if (containers.length > 0) {
          console.log(
            `Found ${containers.length} containers, scraping can start`,
          );
          for (const container of containers) {
            const data = await this.getXpathContent(
              container,
              contentPattern,
              'text',
            );
            data.forEach((d) => console.log(d));
          }
        }
      }
    } catch (error) {
      if (page && !page.isClosed()) {
        await page.close();
      }
      throw error;
    }
  }

  private async getXpathContent(
    containerContext: ElementHandle<SVGElement | HTMLElement>,
    pattern: string,
    returnType: 'text' | 'html',
  ) {
    if (!containerContext) {
      return [];
    }

    const evaluateParam: [string, 'text' | 'html'] = [pattern, returnType];
    const data = await containerContext.evaluate(
      (context, [pattern, returnType]) => {
        const getContent = (el: Node | Element) =>
          returnType === 'text' ? el.nodeValue : (el as Element).innerHTML;
        const vals = document.evaluate(
          pattern as string,
          context,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        const result = [];
        if (vals.snapshotLength > 0) {
          for (let i = 0; i < vals.snapshotLength; i++) {
            result.push(vals.snapshotItem(i));
          }
        }
        return result.map(getContent);
      },
      evaluateParam,
    );
    return data;
  }

  get timeout() {
    return Number(this.config.get<string>('BROWSER_TIMEOUT', '30000'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
