import { $, browser } from '@wdio/globals';

class PaymentPage {
  public get paypalRadio() {
    return $('#PayPal');
  }

  public get btnContinue() {
    return $('button[type="submit"].btn.btn-primary');
  }

  public async selectPaymentMethod(method: 'PayPal' | 'Credit Card' | string): Promise<void> {
    if (method === 'PayPal' || method === 'Credit Card') {
      await this.paypalRadio.click();
    } else {
      throw new Error(`Phương thức thanh toán '${method}' không được hỗ trợ`);
    }
  }

  public async continuePayment(): Promise<void> {
    await this.btnContinue.waitForDisplayed({ timeout: 5000 });

    // Force chọn payment method trước khi Continue
    await this.paypalRadio.scrollIntoView();
    await this.paypalRadio.click();

    // Đợi Redux lưu vào localStorage
    await browser.waitUntil(async () => {
      const cart = await browser.execute(() => JSON.parse(localStorage.getItem('cart') || '{}'));
      return cart && cart.paymentMethod === 'PayPal';
    }, {
      timeout: 10000,
      timeoutMsg: 'Payment method was not saved in localStorage'
    });

    await this.btnContinue.click();
  }
}

export default new PaymentPage();