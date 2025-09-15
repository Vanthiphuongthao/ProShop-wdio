// File: C:\Users\admin\ProShop-wdio\pageobjects\payment.page.js

class PaymentPage {
    // get btnPlaceOrder() { return $('button=Place Order'); }
    get paypalRadio() { return $('#PayPal');
    }
    
    get btnContinue() { return $('button[type="submit"].btn.btn-primary'); }

    async selectPaymentMethod(method) {
        if (method === 'PayPal or Credit Card') {
            await this.paypalRadioBtn.click();
        } else {
            // Xử lý các phương thức khác nếu có
            throw new Error(`Phương thức thanh toán '${method}' không được hỗ trợ`);
        }
    }

    async continuePayment() {
        await this.btnContinue.waitForDisplayed({ timeout: 5000 });

    // Force chọn payment method trước khi Continue
    await this.paypalRadio.scrollIntoView();
    await this.paypalRadio.click();

    // Đợi Redux lưu vào localStorage
    await browser.waitUntil(async () => {
        const cart = await browser.execute(() => JSON.parse(localStorage.getItem('cart')));
        return cart && cart.paymentMethod === 'PayPal';
    }, {
        timeout: 10000,
        timeoutMsg: 'Payment method was not saved in localStorage'
    });

    await this.btnContinue.click();
    
    }
    // get btnPlaceOrder() { return $('button=Place Order'); }
    // async placeOrder() {
    //     await this.btnPlaceOrder.waitForDisplayed({ timeout: 30000 });                           
    //     await this.btnPlaceOrder.click();
    // }
    
 
}

module.exports = new PaymentPage();