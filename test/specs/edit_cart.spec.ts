import { $, browser, expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page';
import cartPage from '../pageobjects/cart.page';
import productsPage from '../pageobjects/products.page';

describe('Edit Cart Functionality (via Add to Cart)', () => {
    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => { localStorage.clear(); sessionStorage.clear(); });
        await browser.deleteCookies();

        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
        await browser.pause(2000);
 });


    it('TC_E2E_PA0_006 - Update quantity in Cart', async () => {
        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a4');
        await productsPage.addToCart();
        await cartPage.updateQuantity("iPhone 13 Pro 256GB Memory", 2);

        const qtyInput = await cartPage.getProductQuantity("iPhone 13 Pro 256GB Memory");
        await expect(await qtyInput.getValue()).toBe("2");
    });

    it('TC_E2E_PA0_007 - Remove product from Cart', async () => {
        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a3');
        await productsPage.addToCart();

        const productName = "Airpods Wireless Bluetooth Headphones";
        await cartPage.removeProductByName(productName);

        const product = await cartPage.getProduct(productName);
        await expect(product).not.toBeExisting();
    });

    it('TC_E2E_PA0_008 - Set quantity exceeding stock', async () => {
        // Add Playstation 5
        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a4');
        await productsPage.addToCart();

        // Set quantity = 11 (exceed stock)
        await cartPage.updateQuantity("iPhone 13 Pro 256GB Memory", 11);

        const errorMsg = await $('//div[contains(text(),"exceeds available stock")]');
        await expect(errorMsg).toBeDisplayed();
    });

    it('TC_E2E_PA0_009 - Set quantity to 0 (should keep 1)', async () => {
        await productsPage.open('/product/68c654b2f62f2bbc3db4e5a5');
        await productsPage.addToCart();

        await cartPage.updateQuantity("Cannon EOS 80D DSLR Camera", 0);

        const qtyInput = await cartPage.getProductQuantity("Cannon EOS 80D DSLR Camera");
        await expect(await qtyInput.getValue()).toBe("0");
    });
});
