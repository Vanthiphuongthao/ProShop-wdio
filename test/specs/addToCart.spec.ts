import { $, browser, expect } from '@wdio/globals';
import productsPage from '../pageobjects/products.page';
import cartPage from '../pageobjects/cart.page';
import loginPage from '../pageobjects/login.page';

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
    
    it('(TC_E2E_PA0_001)- Add a product to cart successfully', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        
        console.log('Navigating directly to Airpods product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCartBtn.waitForDisplayed({ timeout: 10000 });
        
        await browser.pause(2000);
        
        console.log('Adding product to cart...');
        await productsPage.addToCart();
        
        await browser.pause(2000);
        
        console.log('Navigating to cart page...');
        await cartPage.cartIcon.waitForDisplayed({ timeout: 5000 });
        await cartPage.cartIcon.click();
        
        console.log('Verifying product is in the cart...');
        await expect(cartPage.getProduct('Airpods Wireless Bluetooth Headphones')).toBeExisting();
    });
    
    it('(TC_E2E_PA0_002) Add multiple quantities of product', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        
        console.log('Navigating directly to Iphone product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a4');
        
        // Set the quantity to 3.
        console.log('Adding iPhone to cart...');
        await productsPage.addToCart();
        
        await browser.pause(2000);
        
        // Go to cart
        console.log('Navigating to cart page...');
        await cartPage.cartIcon.click();
        
        // Change quantity in cart
        await cartPage.updateQuantity('iPhone 13 Pro 256GB Memory', 3);
        
        await browser.pause(2000);
        
        // Verify
        const qtySelect = await cartPage.getProductQuantity('iPhone 13 Pro 256GB Memory');
        await expect(qtySelect).toHaveValue('3');
    });
    
    it('(TC_E2E_PA0_003)- Add multiple different products', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        
        console.log('Navigating directly to Iphone product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a4');
        await productsPage.addToCart();
        await browser.pause(2000);
        
        console.log('Navigating directly to Cannon EOS DSLR Camera product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a5');
        await productsPage.addToCart();
        await browser.pause(2000);
        
        // Go to the cart page.
        console.log('Navigating to cart page and verifying products...');
        await cartPage.cartIcon.click();
        
        // Verify both products are in the cart.
        await expect($('//a[contains(.,"iPhone")]')).toBeExisting();
        await expect($('//a[contains(.,"Camera")]')).toBeExisting();
    });
    
    it('(TC_E2E_PA0_004)- Prevent adding out-of-stock product', async () => {
        console.log('Navigating to login page...');
        await loginPage.open();
        console.log('Logging in with test account...');
        await loginPage.login('john@email.com', '123456');
        
        console.log('Navigating directly to Amazon Echo Dot 3rd product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a8');
        await browser.pause(2000);
        
        await expect(productsPage.addToCartBtn).toBeDisabled();
    });
    
    it('(TC_E2E_PA0_005)- Add product to cart without login', async () => {
        // Go to a product page without logging in first.
        console.log('Navigating directly to Airpods product page...');
        await browser.url('http://localhost:3000/product/68c654b2f62f2bbc3db4e5a3');
        
        await productsPage.addToCart();
        await browser.pause(2000);
        
        const currentUrl = await browser.getUrl();
        await expect(currentUrl).toContain('/cart');
        await expect($('//a[contains(text(),"Airpods")]')).toBeExisting();
        console.log('Product successfully added to the cart as guest.');
        
        const checkoutBtn = await $('//button[contains(text(),"Proceed To Checkout")]');
        await checkoutBtn.waitForClickable({ timeout: 5000 });
        await checkoutBtn.click();
        
        await browser.pause(2000);
        const redirectUrl = await browser.getUrl();
        console.log(`After checkout, redirected to: ${redirectUrl}`);
        await expect(redirectUrl).toContain('/login');
    });
});