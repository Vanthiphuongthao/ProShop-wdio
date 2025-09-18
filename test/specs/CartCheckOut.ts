import { browser, expect, $ } from "@wdio/globals";
import { LoginPage } from "../pageobjects/login.page";
import { ProductsPage } from "../pageobjects/products.page";
import { CartPage } from "../pageobjects/cart.page";
import { ShippingPage } from "../pageobjects/shipping.page";
import { PaymentPage } from "../pageobjects/payment.page";
import { PlaceOrderPage } from "../pageobjects/placeorder.page";
import { PaypalPage } from "../pageobjects/paypal.page";

describe("Cart Checkout and Confirmation", () => {
  const PAYPAL_EMAIL = "team3@personal.example.com";
  const PAYPAL_PASSWORD = "thechoice19";

  let login: LoginPage;
  let products: ProductsPage;
  let cart: CartPage;
  let shipping: ShippingPage;
  let payment: PaymentPage;
  let placeOrder: PlaceOrderPage;
  let paypal: PaypalPage;

  beforeEach(async () => {
    login = new LoginPage();
    products = new ProductsPage();
    cart = new CartPage();
    shipping = new ShippingPage();
    payment = new PaymentPage();
    placeOrder = new PlaceOrderPage();
    paypal = new PaypalPage();

    await browser.url("http://localhost:3000/");
    await browser.execute(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await browser.deleteCookies();

    await login.open();
    await login.fillEmail("john@email.com");
    await login.fillPassword("123456");
    await login.submit();
    await login.waitForRedirectToHome();
  });

  it("TC_E2E_PAO_010 - Check out with all valid data", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a7");
    await products.addToCart();

    await cart.proceedToCheckout();
    await shipping.fillShipping(
      "15 Tran Bach Dang",
      "Ho Chi Minh",
      "70000",
      "Viet Nam"
    );

    await payment.continuePayment();
    await placeOrder.placeOrder();

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/order/"),
      { timeout: 30000 }
    );
    const paidBadge = await $('//*[contains(text(), "Paid")]');
    await expect(paidBadge).toBeDisplayed();
  });

  it("TC_E2E_PAO_011 - Checkout with empty shipping details", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a3");
    await products.addToCart();

    await cart.proceedToCheckout();
    await shipping.fillShipping("", "", "", "");

    await expect(shipping.errorMessages).toBeDisplayed();
  });

  it("TC_E2E_PAO_012 - Checkout with invalid shipping address", async () => {
    await products.openProduct("68c654b2f62f2bbc3db4e5a3");
    await products.addToCart();

    await cart.proceedToCheckout();
    await shipping.fillShipping("123", "@", "", "!@789abc");

    await expect(shipping.errorMessages).toBeDisplayed();
  });

  it("TC_E2E_PAO_013 - Successfully place order after PayPal payment", async () => {
    await products.open("68c654b2f62f2bbc3db4e5a7");
    await products.addToCart();

    await cart.proceedToCheckout();
    await shipping.fillShipping(
      "15 Tran Bach Dang",
      "Ho Chi Minh",
      "70000",
      "Viet Nam"
    );

    await payment.continuePayment();
    await placeOrder.placeOrder();
    await placeOrder.payWithPayPal();

    // Switch to PayPal window
    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[handles.length - 1]);

    const iframe = await $('iframe[name="__paypal_checkout_frame"]');
    if (await iframe.isExisting()) {
      await browser.switchToFrame(iframe);
    }

    await paypal.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
    await paypal.completePurchase();

    // Switch back to localhost
    const allHandles = await browser.getWindowHandles();
    for (const h of allHandles) {
      await browser.switchToWindow(h);
      if ((await browser.getUrl()).includes("localhost:3000")) break;
    }

    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/order/"),
      {
        timeout: 50000,
      }
    );

    const paidBadge = await $('//*[contains(text(), "Paid")]');
    await expect(paidBadge).toBeDisplayed();
  });
});
