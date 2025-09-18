import { $, $$, browser } from "@wdio/globals";
import Page from "./page";

export class OrderListPage extends Page {
  // ===== Elements =====
  public get table() {
    return $("div.table-responsive table");
  }
  public get tableHeaders() {
    return $$("div.table-responsive thead th");
  }
  public get tableRows() {
    return $$("div.table-responsive tbody tr");
  }
  public get firstRow() {
    return $("div.table-responsive tbody tr:first-child");
  }

  // ===== Navigation =====
  public async open(): Promise<void> {
    await super.open("/admin/orderlist");
    await this.waitForLoaded();
  }

  public async waitForLoaded(): Promise<void> {
    await this.table.waitForDisplayed({ timeout: 10000 });
    await browser.waitUntil(
      async () => {
        const rows = await this.tableRows;
        return (await rows.length) > 0; // không await rows.length
      },
      {
        timeout: 10000,
        interval: 200,
        timeoutMsg: "Orders table did not load",
      }
    );
  }

  // ===== Helpers for row =====
  public async getRowByIndex(index: number) {
    const rows = await this.tableRows;
    const length = rows.length;
    if ((await length) <= index) {
      throw new Error(`Row index ${index} out of range (have ${length})`);
    }
    return rows[index];
  }

  public async getOrderId(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(1)").getText();
  }
  public async getUser(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(2)").getText();
  }
  public async getDate(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(3)").getText();
  }
  public async getTotal(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(4)").getText();
  }
  public async getPaidStatus(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(5)").getText();
  }
  public async getDeliveredStatus(row: WebdriverIO.Element) {
    return await row.$("td:nth-child(6)").getText();
  }
  public async getDeliveredCell(row: WebdriverIO.Element) {
    return row.$("td:nth-child(6)");
  }
  public async getDeliveredDate(row: WebdriverIO.Element) {
    const text = (await this.getDeliveredStatus(row)).trim();
    const m = text.match(/^\d{4}-\d{2}-\d{2}$/);
    return m ? text : "";
  }

  // ===== Status helpers =====
  public async isPaid(row: WebdriverIO.Element) {
    const cell = await row.$("td:nth-child(5)");
    const text = (await cell.getText()).trim();
    if (text) return true; // date present
    const hasIcon = await cell
      .$("svg")
      .isExisting()
      .catch(() => false);
    return !hasIcon ? Boolean(text) : false;
  }

  public async isDelivered(row: WebdriverIO.Element) {
    const cell = await this.getDeliveredCell(row);
    const text = (await cell.getText()).trim();
    if (text) return true; // date present
    const hasIcon = await cell
      .$("svg")
      .isExisting()
      .catch(() => false);
    return !hasIcon ? Boolean(text) : false;
  }

  public async waitUntilDeliveredById(orderId: string, timeout = 20000) {
    const start = Date.now();
    let refreshed = false;
    while (Date.now() - start < timeout) {
      await this.waitForLoaded();
      const row = await this.getRowByOrderId(orderId).catch(() => null);
      if (row) {
        if (await this.isDelivered(row)) {
          return await this.getDeliveredDate(row);
        }
      }
      if (!refreshed && Date.now() - start > 8000) {
        try {
          await browser.refresh();
        } catch {}
        await this.waitForLoaded();
        refreshed = true;
      }
      await browser.pause(300);
    }
    throw new Error(`Order ${orderId} did not show Delivered in list`);
  }

  public async clickDetails(row: WebdriverIO.Element) {
    let link = await row.$("a=Details");
    if (!(await link.isExisting())) {
      link = await row.$("*=Details");
    }
    await link.scrollIntoView();
    await link.waitForClickable({ timeout: 5000 });
    await link.click();

    try {
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes("/order/"),
        { timeout: 5000 }
      );
    } catch (e) {
      const href = await link.getAttribute("href");
      if (href) await browser.url(href);
      await browser.waitUntil(
        async () => (await browser.getUrl()).includes("/order/"),
        {
          timeout: 8000,
          timeoutMsg: "Did not navigate to Order Detail page",
        }
      );
    }
  }

  public async getRowByOrderId(orderId: string) {
    const rows = await this.tableRows;
    for (const row of rows) {
      const id = await this.getOrderId(row);
      if (id.includes(orderId)) return row;
    }
    throw new Error(`OrderId ${orderId} not found in list`);
  }
}
