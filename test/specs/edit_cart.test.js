const loginPage = require('../../pageobjects/login.page');
const cartPage = require('../../pageobjects/cart.page');
const productsPage = require('../../pageobjects/products.page');

describe('Edit Cart Functionality (via Add to Cart)', () => {
    // Trước mỗi test: clear storage, login
    beforeEach(async () => {
        await browser.url('http://localhost:3000/');
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await browser.deleteCookies();

        // Mở trang login và login
        await loginPage.open();
        await loginPage.login('john@email.com', '123456');
    });

    it('TC_E2E_PA0_006 - Update quantity in Cart', async () => {
        // Add iPhone 13 Pro
        await browser.url('http://localhost:3000/product/68c10b39090273763ad95c9a');
        await productsPage.addToCart();
        
        // Update quantity = 2
        await cartPage.updateQuantity("iPhone 13 Pro 256GB Memory", 2);

        const qtyInput = await cartPage.getProductQuantity("iPhone 13 Pro 256GB Memory");
        await expect(await qtyInput.getValue()).toBe("2");
    });

    it('TC_E2E_PA0_007 - Remove product from Cart', async () => {
        // Add Airpods
        await browser.url('http://localhost:3000/product/68c10b39090273763ad95c99');
        await productsPage.addToCart();

        // Remove Airpods
        const productName = "Airpods Wireless Bluetooth Headphones"; // Define the variable
        await cartPage.removeProductByName(productName);

        // Verify product is removed
        const product = await cartPage.getProduct(productName);
        await expect(product).not.toBeExisting();
    });

    it('TC_E2E_PA0_008 - Set quantity exceeding stock', async () => {
        // Add Playstation 5
        await browser.url('http://localhost:3000/product/68c10b39090273763ad95c9a');
        await productsPage.addToCart();

        // Set quantity = 11 (exceed stock)
        await cartPage.updateQuantity("iPhone 13 Pro 256GB Memory", 11);

        const errorMsg = await $('//div[contains(text(),"exceeds available stock")]');
        await expect(errorMsg).toBeDisplayed();
    });

    it('TC_E2E_PA0_009 - Set quantity to 0 (should keep 1)', async () => {
        // Add Camera
        await browser.url('http://localhost:3000/product/68c10b39090273763ad95c9b');
        await productsPage.addToCart();

        // Set quantity = 0, CartPage sẽ giữ 1
        await cartPage.updateQuantity("Cannon EOS 80D DSLR Camera", 0);

        const qtyInput = await cartPage.getProductQuantity("Cannon EOS 80D DSLR Camera");
        await expect(await qtyInput.getValue()).toBe("1");
    });
});
