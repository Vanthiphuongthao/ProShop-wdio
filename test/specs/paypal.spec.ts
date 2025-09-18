import { browser, expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page';
import productsPage from '../pageobjects/products.page';
import cartPage from '../pageobjects/cart.page';
import shippingPage from '../pageobjects/shipping.page';
import paymentPage from '../pageobjects/payment.page';
import placeOrderPage from '../pageobjects/placeorder.page';
import paypalPage from '../pageobjects/paypal.page';

describe('Payment with PayPal Test Suite', () => {
    const PAYPAL_EMAIL = 'team3@personal.example.com';
    const PAYPAL_PASSWORD = 'thechoice19';

    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => { localStorage.clear(); sessionStorage.clear(); });
        await browser.deleteCookies();

        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.pause(3000);
    });

    it('TC_EJE_PP_001- Successful payment with PayPal', async () => {
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

    it('TC_EJE_PP_003- User cancels payment on PayPal page', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a7');
        await productsPage.addToCart();
        await cartPage.proceedToCheckout();

        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await paymentPage.continuePayment();

        await placeOrderPage.placeOrder();
        await placeOrderPage.payWithPayPal();
        await browser.pause(5000);

        const mainWindowHandle = await browser.getWindowHandle();

        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) await browser.switchToFrame(iframe);

        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
        await paypalPage.cancelPayment();
        await browser.switchToWindow(mainWindowHandle);
        
        const finalUrl = await browser.getUrl(); 
        console.log('Redirected to:', finalUrl);
        await expect(finalUrl).toContain('/order/');
    });
       it('TC_EJE_PP_004- Payment with insufficient funds', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a5');
        await productsPage.addToCart(); 
        await cartPage.updateQuantity('Cannon EOS 80D DSLR Camera', 3);
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
        const paidBadge = await $('//*[contains(text(), "Not paid")]');
        await expect(paidBadge).toBeDisplayed();
    });
});

    it('TC_EJE_PP_002- Invalid PayPal credentials', async () => {
        await productsPage.openProduct('68c654b2f62f2bbc3db4e5a7');
        await productsPage.addToCart();
        await cartPage.proceedToCheckout();

        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();
        await placeOrderPage.payWithPayPal();

        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) await browser.switchToFrame(iframe);

        await paypalPage.loginAndPay('hello@personal.example.com', '12345678');
        const errorEl = await $('p.notification.notification-critical[role="alert"]');
        await errorEl.waitForDisplayed({ timeout: 30000 });
        const errorText = await errorEl.getText();
        expect(errorText).toContain("Some of your info isn't correct");
    });

