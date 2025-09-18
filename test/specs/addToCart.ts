import { $, browser, expect } from "@wdio/globals";
// import productsPage from '../pageobjects/products.page';
// import cartPage from '../pageobjects/cart.page';
// import loginPage from '../pageobjects/login.page';
import { LoginPage } from "../pageobjects/login.page";
import { ProductsPage } from "../pageobjects/products.page";
import { CartPage } from "../pageobjects/cart.page";

describe("Add To Cart Functionality", () => {
  let login: LoginPage;
  let products: ProductsPage;
  let cart: CartPage;

  beforeEach(async () => {
    // Tina
    login = new LoginPage();
    products = new ProductsPage();
    cart = new CartPage();
    //

    await browser.url("http://localhost:3000/");
    await browser.execute(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await browser.deleteCookies();

    // Tina
    await login.open();
    await login.fillEmail("john@email.com");
    await login.fillPassword("123456");
    await login.submit();
    await login.waitForRedirectToHome();
    //
  });

  it("(TC_E2E_PA0_001)- Add a product to cart successfully", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a3");
    await products.addToCart();

    await cart.cartIcon.waitForDisplayed({ timeout: 5000 });
    await cart.cartIcon.click();

    await expect(
      cart.getProduct("Airpods Wireless Bluetooth Headphones")
    ).toBeExisting();
  });

  it("(TC_E2E_PA0_002) Add multiple quantities of product", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a4");
    await products.addToCart();

    await cart.cartIcon.click();
    await cart.updateQuantity("iPhone 13 Pro 256GB Memory", 3);

    const qtySelect = await cart.getProductQuantity(
      "iPhone 13 Pro 256GB Memory"
    );
    await expect(qtySelect).toHaveValue("3");
  });

  it("(TC_E2E_PA0_003)- Add multiple different products", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a4");
    await products.addToCart();

    await products.open("68c654b2f62f2bbc3db4e5a5");
    await products.addToCart();

    await cart.cartIcon.click();

    await expect($('//a[contains(.,"iPhone")]')).toBeExisting();
    await expect($('//a[contains(.,"Camera")]')).toBeExisting();
  });

  it("(TC_E2E_PA0_004)- Prevent adding out-of-stock product", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a8");
    await expect(products.addToCartBtn).toBeDisabled();
  });
});

//Tina
describe("Add To Cart without login", () => {
  let products: ProductsPage;
  let cart: CartPage;

  beforeEach(async () => {
    products = new ProductsPage();
    cart = new CartPage();

    await browser.url("http://localhost:3000/");
    await browser.execute(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await browser.deleteCookies();
  });

  it("(TC_E2E_PA0_005) Add product to cart without login", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a3");
    await products.addToCart();

    await expect(browser).toHaveUrl("/cart");
    await expect($('//a[contains(text(),"Airpods")]')).toBeExisting();

    await cart.btnCheckout.waitForClickable({ timeout: 5000 });
    await cart.btnCheckout.click();

    await expect(browser).toHaveUrl("/login");
  });
});
