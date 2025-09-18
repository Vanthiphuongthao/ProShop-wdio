import { $, browser, expect } from '@wdio/globals';
import productsPage from '../pageobjects/products.page';
import cartPage from '../pageobjects/cart.page';
import loginPage from '../pageobjects/login.page';

describe('Add To Cart Functionality', () => {
    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => { localStorage.clear(); sessionStorage.clear(); });
        await browser.deleteCookies();

        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.pause(3000);
    });

    it('(TC_E2E_PA0_001)- Add a product to cart successfully', async () => {

        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();

        await cartPage.cartIcon.waitForDisplayed({ timeout: 5000 });
        await cartPage.cartIcon.click();

        await expect(cartPage.getProduct('Airpods Wireless Bluetooth Headphones')).toBeExisting();
    });

    it('(TC_E2E_PA0_002) Add multiple quantities of product', async () => {

        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a4');
        await productsPage.addToCart();

        await cartPage.cartIcon.click();
        await cartPage.updateQuantity('iPhone 13 Pro 256GB Memory', 3);

        const qtySelect = await cartPage.getProductQuantity('iPhone 13 Pro 256GB Memory');
        await expect(qtySelect).toHaveValue('3');
    });

    it('(TC_E2E_PA0_003)- Add multiple different products', async () => {

        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a4');
        await productsPage.addToCart();

        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a5');
        await productsPage.addToCart();

        await cartPage.cartIcon.click();

        await expect($('//a[contains(.,"iPhone")]')).toBeExisting();
        await expect($('//a[contains(.,"Camera")]')).toBeExisting();
    });

    it('(TC_E2E_PA0_004)- Prevent adding out-of-stock product', async () => {

        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a8');
        await expect(productsPage.addToCartBtn).toBeDisabled();
    });
    });

    it('(TC_E2E_PA0_005)- Add product to cart without login', async () => {
        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();

        expect(browser).toHaveUrl('/cart');
        await expect($('//a[contains(text(),"Airpods")]')).toBeExisting();

        await cartPage.btnCheckout.waitForClickable({ timeout: 5000 });
        await cartPage.btnCheckout.click();

        expect(browser).toHaveUrl('/login');
    });

