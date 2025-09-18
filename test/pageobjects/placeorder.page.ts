import { $, browser } from "@wdio/globals";
import Page from "./page";

export class PlaceOrderPage extends Page {
  public get btnPlaceOrder() {
    return $("button=Place Order");
  }

  public get paypalButton() {
    return $('div[id*="paypal"], div[class*="paypal"]');
  }

  public async open(): Promise<void> {
    await super.open("/placeorder");
  }

  public async placeOrder(): Promise<void> {
    await this.btnPlaceOrder.waitForDisplayed({ timeout: 5000 });
    await this.btnPlaceOrder.waitForClickable({ timeout: 5000 });
    await this.btnPlaceOrder.click();
  }

  public async payWithPayPal(): Promise<void> {
    await this.paypalButton.waitForDisplayed({ timeout: 20000 });
    await this.paypalButton.waitForClickable({ timeout: 20000 });
    await this.paypalButton.click();

    // thay pause = waitUntil để test ổn định hơn
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("paypal"),
      { timeout: 10000, timeoutMsg: "Did not redirect to PayPal" }
    );
  }
}
