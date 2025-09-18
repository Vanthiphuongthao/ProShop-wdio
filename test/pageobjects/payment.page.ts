import { $, browser } from '@wdio/globals';
import Page from './page';

class PaymentPage extends Page {
    public get paypalRadio() { return $('#PayPal'); }
    public get btnContinue() { return $('button[type="submit"].btn.btn-primary'); }

    public async continuePayment() : Promise<void> {
        await this.paypalRadio.waitForDisplayed({ timeout: 10000 });
        await this.paypalRadio.waitForClickable({ timeout: 10000 });
        await this.paypalRadio.scrollIntoView();
        await this.paypalRadio.click();

        await browser.waitUntil(async () => {
            const cart = await browser.execute(() => JSON.parse(localStorage.getItem('cart') || '{}'));
            return cart && cart.paymentMethod === 'PayPal';
        }, { timeout: 10000 });

        await this.btnContinue.waitForDisplayed({ timeout: 10000 });
        await this.btnContinue.waitForClickable({ timeout: 10000 });
        await this.btnContinue.click();
    }
    }

export default new PaymentPage();
