import { $, browser } from '@wdio/globals';
import Page from './page';

class PlaceOrderPage extends Page {
    public get btnPlaceOrder() { return $('button=Place Order'); }
    public get paypalButton() { return $('div[id*="paypal"], div[class*="paypal"]'); }

    public async placeOrder() { 
        await this.btnPlaceOrder.waitForDisplayed({ timeout: 5000 }); 
        await this.btnPlaceOrder.click();
    }

    public async open() { await super.open('/placeorder'); }

    public async payWithPayPal() {
        await this.paypalButton.waitForDisplayed({ timeout: 20000 });
        await this.paypalButton.waitForClickable({ timeout: 20000 });
        await this.paypalButton.click();
        await browser.pause(2000); 
}

}

export default new PlaceOrderPage();
