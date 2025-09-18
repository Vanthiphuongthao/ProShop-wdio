import { browser } from "@wdio/globals";
import Page from "./page";

export class OrderDetailsPage extends Page {
  deliveredBtn: any;
  // ===== Elements =====
  public get container() {
    return $("div.order-details, main div"); // fallback nếu layout thay đổi
  }

  public get markAsDeliveredBtn() {
    return $("button=Mark As Delivered");
  }

  public get paidStatus() {
    return $("div.paid-status");
  }

  public get deliveredStatus() {
    return $("div.delivered-status");
  }

  // ===== Navigation =====
  public async open(orderId: string): Promise<void> {
    await super.open(`/order/${orderId}`);
    await this.waitForLoaded();
  }

  public async waitForLoaded(): Promise<void> {
    await this.container.waitForDisplayed({ timeout: 10000 });
  }

  // ===== Actions =====
  public async clickMarkAsDelivered(): Promise<void> {
    const btn = await this.markAsDeliveredBtn;
    await btn.waitForClickable({ timeout: 5000 });
    await btn.click();

    // Sau khi click, chờ Delivered status hiển thị
    await browser.waitUntil(
      async () => (await this.getDeliveredStatus()).includes("Delivered"),
      {
        timeout: 8000,
        interval: 300,
        timeoutMsg: "Delivered status did not update after clicking button",
      }
    );
  }

  // ===== Getters =====
  public async getPaidStatus(): Promise<string> {
    return (await this.paidStatus.getText()).trim();
  }

  public async getDeliveredStatus(): Promise<string> {
    return (await this.deliveredStatus.getText()).trim();
  }

  public async isPaid(): Promise<boolean> {
    const text = await this.getPaidStatus();
    return (
      text.toLowerCase().includes("paid") || /^\d{4}-\d{2}-\d{2}/.test(text)
    );
  }

  public async isDelivered(): Promise<boolean> {
    const text = await this.getDeliveredStatus();
    return (
      text.toLowerCase().includes("delivered") ||
      /^\d{4}-\d{2}-\d{2}/.test(text)
    );
  }
}
