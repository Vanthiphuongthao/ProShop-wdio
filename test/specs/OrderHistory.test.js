const productsPage = require('../../pageobjects/products.page');
const cartPage = require('../../pageobjects/cart.page');
const loginPage = require('../../pageobjects/login.page'); // Import file loginPage vừa tạo

describe('Add To Cart Functionality', () => {
    beforeEach(async () => {
    await browser.url('http://localhost:3000/');

    // Delete localStorage & sessionStorage
    await browser.execute(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await browser.deleteCookies();
});

    it('TC_E2E_VOH_001 - View past orders successfully', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        // Navigate tới Profile / Order History
        await browser.url('http://localhost:3000/profile');
        await browser.pause(5000); 

    });

    it('TC_E2E_VOH_002 - View order history with no past orders', async () => {
       
        // Login user mới chưa có order
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('httphoaian@gmail.com', 'thechoice19');

        // Vào profile
        await browser.url('http://localhost:3000/profile');
        await browser.pause(5000); 

        console.log('Expected message: "Order not found"');

    });

    it('(TC_E2E_VOH_003 - View details of an existing order ', async () => {
        // Preconditions: User is logged in and has at least 1 past order.
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        
        await browser.url('http://localhost:3000/profile');
        
        const orderIdToTest = '68c6bc19e6223407b8f0d28';
        
        // Find and click the "Details" button for a specific order.
        const firstDetailsBtn = await $('table tbody tr:first-child a.btn.btn-sm.btn-light');
        await firstDetailsBtn.waitForExist({ timeout: 10000 });
        await firstDetailsBtn.click();
        await browser.pause(5000);
    });

    it('TC_E2E_VOH_004 - Unauthorized access to another user’s order details', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('httphoaian@gmail.com', 'thechoice19');
        await browser.url('http://localhost:3000/order/68c65c79ef6223407f8f0e28');
        await browser.pause(5000); 
        console.log('Expected message: "User can access order details without being blocked"');
    });

});
