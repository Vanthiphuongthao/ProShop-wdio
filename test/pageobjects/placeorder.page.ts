import { $, browser } from '@wdio/globals';

class PlaceOrderPage {
  public get btnPlaceOrder() {
    return $('button=Place Order');
  }

  public async placeOrder(): Promise<void> {
    await this.btnPlaceOrder.waitForDisplayed({ timeout: 5000 });
    await this.btnPlaceOrder.click();
  }

  public get paypalButton() {
    return $('div[id*="paypal"], div[class*="paypal"]');
  }
}

export default new PlaceOrderPage();