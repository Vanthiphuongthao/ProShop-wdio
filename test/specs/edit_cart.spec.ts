import { browser, expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page';

describe('Order History Functionality', () => {
    beforeEach(async () => {
        await browser.url('/');
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await browser.deleteCookies();
    });

    it('TC_E2E_VOH_001 - View past orders successfully', async () => {
        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.url('/profile');
        await expect(browser).toHaveUrl('/profile');
        const ordersTable = await $('table');
        await expect(ordersTable).toBeDisplayed();
    });

    it('TC_E2E_VOH_002 - View order history with no past orders', async () => {
        await loginPage.open();
        await loginPage.login('conrad@gmail.com', '123456');

        await browser.url('/profile');

        const noOrderMsg = await $('//*[contains(text(),"Order not found")]');
        await expect(noOrderMsg).toBeDisplayed();
    });

    it('TC_E2E_VOH_003 - View details of an existing order', async () => {
        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.url('/profile');
        const firstDetailsBtn = await $('table tbody tr:first-child a.btn.btn-sm.btn-light');
        await firstDetailsBtn.click();

        await expect(browser).toHaveUrl('/order/');
        const orderTitle = await $('h1=Order');
        await expect(orderTitle).toBeDisplayed();
    });

    it('TC_E2E_VOH_004 - Unauthorized access to another user’s order details', async () => {
        await loginPage.open();
        await loginPage.login('httphoaian@gmail.com', 'thechoice19');

        await browser.url('/order/68c7b6c48824a9dc3e33ae00');

        const errorMsg = await $('//*[contains(text(),"Not authorized")]');
        await expect(errorMsg).toBeDisplayed();
    });
});
