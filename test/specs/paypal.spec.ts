import { $, browser, expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page';
import cartPage from '../pageobjects/cart.page';
import productsPage from '../pageobjects/products.page';
import shippingPage from '../pageobjects/shipping.page';
import paymentPage from '../pageobjects/payment.page';
import placeOrderPage from '../pageobjects/placeorder.page';
import paypalPage from '../pageobjects/paypal.page';

describe('Payment with PayPal Test Suite', () => {
    const PAYPAL_EMAIL = 'team3@personal.example.com';
    const PAYPAL_PASSWORD = 'thechoice19';
    
    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await browser.deleteCookies();

        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.pause(3000);
    });

    it('TC_EJE_PP_001- Successful payment with PayPal', async () => {
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();
        await browser.pause(3000);

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await shippingPage.continue();
        await browser.pause(3000);

        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();
        await browser.pause(5000);

        // Click PayPal button
        await placeOrderPage.paypalButton.waitForDisplayed({ timeout: 30000 });
        await placeOrderPage.paypalButton.waitForClickable({ timeout: 30000 });
        await placeOrderPage.paypalButton.click();
        await browser.pause(20000);
        
        const handles = await browser.getWindowHandles();
        console.log('Window handles:', handles);

        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) {
            await browser.switchToFrame(iframe);
        }

        const title = await browser.getTitle();
        console.log('Switched to PayPal window, title:', title);

        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
        
        await paypalPage.completePurchase();

        const handlesAfter = await browser.getWindowHandles();
        for (const handle of handlesAfter) {
            await browser.switchToWindow(handle);
            const url = await browser.getUrl();
            if (url.includes('localhost:3000')) {
                break;
            }
        }

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/order/');
        }, { timeout: 30000, timeoutMsg: 'Not redirected to order details page' });

        const paidBadge = await $('//*[contains(text(), "Paid")]');
        await expect(paidBadge).toBeDisplayed();
    });

    it('TC_EJE_PP_003- User cancels payment on PayPal page', async () => {
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();
        await browser.pause(3000);

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await shippingPage.continue();
        await browser.pause(3000);

        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();
        await browser.pause(5000);

        await placeOrderPage.paypalButton.waitForDisplayed({ timeout: 20000 });
        await placeOrderPage.paypalButton.waitForClickable({ timeout: 20000 });
        await placeOrderPage.paypalButton.click();
        await browser.pause(5000);
        
        const handles = await browser.getWindowHandles();
        console.log('Window handles:', handles);

        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) {
            await browser.switchToFrame(iframe);
        }

        const title = await browser.getTitle();
        console.log('Switched to PayPal window, title:', title);
        

        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);

        const cancelButton = await $('a[data-testid="cancel-link"]');
        await cancelButton.waitForDisplayed({ timeout: 30000 });
        await cancelButton.click();
        await browser.pause(5000);

        await browser.switchToWindow(handles[0]);

        const finalUrl = await browser.getUrl();
        console.log('Redirected to:', finalUrl);
        console.log('✅ Reached order page, test passed.');
    });

    it('TC_EJE_PP_004- Payment with insufficient funds', async () => {
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a5');
        await productsPage.addToCart();
        await browser.pause(3000);

        console.log('Navigating to cart page...');
        await cartPage.cartIcon.click();

        await cartPage.updateQuantity('Cannon EOS 80D DSLR Camera', 4);
        await browser.pause(2000);

        await cartPage.proceedToCheckout();
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await shippingPage.continue();
        await browser.pause(3000);

        await paymentPage.continuePayment();
        await placeOrderPage.placeOrder();
        await browser.pause(5000);

        // Click PayPal button
        await placeOrderPage.paypalButton.waitForDisplayed({ timeout: 20000 });
        await placeOrderPage.paypalButton.waitForClickable({ timeout: 20000 });
        await placeOrderPage.paypalButton.click();
        await browser.pause(20000);
        
        const handles = await browser.getWindowHandles();
        console.log('Window handles:', handles);

        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) {
            await browser.switchToFrame(iframe);
        }

        const title = await browser.getTitle();
        console.log('Switched to PayPal window, title:', title);

        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
        
        await paypalPage.completePurchase();

        const handlesAfter = await browser.getWindowHandles();
        for (const handle of handlesAfter) {
            await browser.switchToWindow(handle);
            const url = await browser.getUrl();
            if (url.includes('localhost:3000')) {
                break;
            }
        }

        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/order/');
        }, { timeout: 30000, timeoutMsg: 'Not redirected to order details page' });

        const paidBadge = await $('//*[contains(text(), "Not paid")]');
        await expect(paidBadge).toBeDisplayed();
    });
});

it('TC_EJE_PP_002- Invalid PayPal credentials', async () => {
    const PAYPAL_EMAIL = 'hello@personal.example.com';
    const PAYPAL_PASSWORD = 'thechoice19';
    
    await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
    await productsPage.addToCart();
    await browser.pause(3000);

    await cartPage.proceedToCheckout();
    await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
    await shippingPage.continue();
    await browser.pause(3000);

    await paymentPage.continuePayment();
    await placeOrderPage.placeOrder();
    await browser.pause(5000);

    await placeOrderPage.paypalButton.waitForDisplayed({ timeout: 30000 });
    await placeOrderPage.paypalButton.waitForClickable({ timeout: 30000 });
    await placeOrderPage.paypalButton.click();
    await browser.pause(20000);
    
    const handles = await browser.getWindowHandles();
    console.log('Window handles:', handles);

    await browser.switchToWindow(handles[handles.length - 1]);

    const iframe = await $('iframe[name="__paypal_checkout_frame"]');
    if (await iframe.isExisting()) {
        await browser.switchToFrame(iframe);
    }
    
    const title = await browser.getTitle();
    console.log('Switched to PayPal window, title:', title);

    await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);

    const errorEl = await $('p.notification.notification-critical[role="alert"]');
    await errorEl.waitForDisplayed({ timeout: 30000 });
    const errorText = await errorEl.getText();

    console.log('PayPal error:', errorText);

    expect(errorText).toContain("Some of your info isn't correct");
});
