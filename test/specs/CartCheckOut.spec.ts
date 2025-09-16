import { $, browser, expect } from '@wdio/globals';
import productsPage from '../pageobjects/products.page';
import cartPage from '../pageobjects/cart.page';
import loginPage from '../pageobjects/login.page';
import shippingPage from '../pageobjects/shipping.page';
import paymentPage from '../pageobjects/payment.page';
import placeOrderPage from '../pageobjects/placeorder.page';
import paypalPage from '../pageobjects/paypal.page';

describe('Cart Checkout and Confirmation', () => {
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

    it('TC_E2E_PAO_010 - Check out with all valid data', async () => {
        // Add product
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a7');
        await productsPage.addToCart();
        await browser.pause(2000);

        // Go to Cart and proceed
        await cartPage.proceedToCheckout();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/shipping'),
            {
                timeout: 30000,
                timeoutMsg: 'Expected to be on the shipping page after 30s'
            }
        );

        // Fill shipping & payment
        await shippingPage.fillShipping('15 Tran Bach Dang', 'Ho Chi Minh', '70000', 'Viet Nam');
        await shippingPage.continue();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/payment'),
            {
                timeout: 30000,
                timeoutMsg: 'Expected to be on the payment page after 30s'
            }
        );
        await paymentPage.continuePayment();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/placeorder'),
            { timeout: 30000, timeoutMsg: 'Expected to be on the order summary page after 30s' }
        );

        // Dùng page object để click
        await placeOrderPage.placeOrder();
        await browser.pause(3000);

        // Sau đó check đã tới trang order/:id
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/order/'),
            { timeout: 30000, timeoutMsg: 'Expected to be on the order confirmation page after placing order' }
        );
    });

    it('TC_E2E_PAO_011 - Checkout with empty shipping details', async () => {
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();
        await browser.pause(2000);

        // Go to Cart and proceed
        await cartPage.proceedToCheckout();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/shipping'),
            {
                timeout: 30000,
                timeoutMsg: 'Expected to be on the shipping page after 30s'
            }
        );

        // Fill shipping & payment
        await shippingPage.fillShipping('', '', '', '');
        await shippingPage.continue();

        await expect(shippingPage.errorMessages).toBeDisplayed();
    });

    it('TC_E2E_PAO_012 - Checkout with invalid shipping address', async () => {
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();
        await browser.pause(2000);

        // Go to Cart and proceed
        await cartPage.proceedToCheckout();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/shipping'),
            {
                timeout: 30000,
                timeoutMsg: 'Expected to be on the shipping page after 30s'
            }
        );

        // Fill shipping & payment
        await shippingPage.fillShipping('123', '@', '456aa', '!@789abc');
        await shippingPage.continue();
        
        await expect(shippingPage.errorMessages).toBeDisplayed();
    });

    it('TC_E2E_PAO_013 - Successfully place order after payment', async () => {
        // Add product
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a7');
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
        await placeOrderPage.paypalButton.waitForDisplayed({ timeout: 20000 });
        await placeOrderPage.paypalButton.waitForClickable({ timeout: 20000 });
        await placeOrderPage.paypalButton.click();
        await browser.pause(20000);

        // Lấy tất cả iframe trong popup
        const handles = await browser.getWindowHandles();
        console.log('Window handles:', handles);

        // Chuyển sang popup (cửa sổ cuối cùng)
        await browser.switchToWindow(handles[handles.length - 1]);

        const iframe = await $('iframe[name="__paypal_checkout_frame"]');
        if (await iframe.isExisting()) {
            await browser.switchToFrame(iframe);
        }
        
        // Debug: lấy source coi đúng form Sign Up chưa
        const title = await browser.getTitle();
        console.log('Switched to PayPal window, title:', title);

        await paypalPage.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
        
        await paypalPage.completePurchase();

        // Sau khi bấm Complete Purchase, PayPal redirect về app
        // Switch về window localhost
        const handlesAfter = await browser.getWindowHandles();
        for (const handle of handlesAfter) {
            await browser.switchToWindow(handle);
            const url = await browser.getUrl();
            if (url.includes('localhost:3000')) {
                break;
            }
        }

        // Chờ order page load
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/order/');
        }, { timeout: 30000, timeoutMsg: 'Not redirected to order details page' });

        // Verify order đã paid
        const paidBadge = await $('//*[contains(text(), "Paid")]');
        await expect(paidBadge).toBeDisplayed();
    });
});