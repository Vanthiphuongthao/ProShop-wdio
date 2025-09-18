import { browser, expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page';
import productsPage from '../pageobjects/products.page';
import cartPage from '../pageobjects/cart.page';
import shippingPage from '../pageobjects/shipping.page';
import paymentPage from '../pageobjects/payment.page';
import placeOrderPage from '../pageobjects/placeorder.page';
import paypalPage from '../pageobjects/paypal.page';

describe('Cart Checkout and Confirmation', () => {
    const PAYPAL_EMAIL = 'team3@personal.example.com';
    const PAYPAL_PASSWORD = 'thechoice19';

    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => { localStorage.clear(); sessionStorage.clear(); });
        await browser.deleteCookies();

        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.pause(2000);
    });

    it('TC_E2E_PAO_010 - Check out with all valid data', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a7');
        await productsPage.addToCart();

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');

        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();

        await browser.waitUntil(async () => (await browser.getUrl()).includes('/order/'), { timeout: 30000 });
        const paidBadge = await $('//*[contains(text(), "Paid")]');
        await expect(paidBadge).toBeDisplayed();
    });

    it('TC_E2E_PAO_011 - Checkout with empty shipping details', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('', '', '', '');

        await expect(shippingPage.errorMessages).toBeDisplayed();
    });

    it('TC_E2E_PAO_012 - Checkout with invalid shipping address', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('123', '@', '', '!@789abc');

        await expect(shippingPage.errorMessages).toBeDisplayed();
    });

    it('TC_E2E_PAO_013 - Successfully place order after PayPal payment', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a7');
        await productsPage.addToCart();

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');

        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();
        await placeOrderPage.payWithPayPal();

        // Switch to PayPal window
        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) await browser.switchToFrame(iframe);

        
        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
        await paypalPage.completePurchase();

        // Switch back to localhost
        const allHandles = await browser.getWindowHandles();
        for (const h of allHandles) {
            await browser.switchToWindow(h);
            if ((await browser.getUrl()).includes('localhost:3000')) break;
        }

        await browser.waitUntil(async () => (await browser.getUrl()).includes('/order/'), { timeout: 50000  });
        await browser.pause(2000);
        const paidBadge = await $('//*[contains(text(), "Paid")]');
        await expect(paidBadge).toBeDisplayed();
    });
});
