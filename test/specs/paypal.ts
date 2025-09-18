import { browser, expect } from "@wdio/globals";
import { LoginPage } from "../pageobjects/login.page";
import { ProductsPage } from "../pageobjects/products.page";
import { CartPage } from "../pageobjects/cart.page";
import { ShippingPage } from "../pageobjects/shipping.page";
import { PaymentPage } from "../pageobjects/payment.page";
import { PlaceOrderPage } from "../pageobjects/placeorder.page";
import { PaypalPage } from "../pageobjects/paypal.page";

describe("Payment with PayPal Test Suite", () => {
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
    await login.login("john@email.com", "123456");
    await browser.pause(3000);
  });

  it("TC_EJE_PP_001 - Successful payment with PayPal", async () => {
    await products.openProduct("68c654b2f62f2bbc3db4e5a7");
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
    if (await iframe.isExisting()) await browser.switchToFrame(iframe);

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
      { timeout: 50000 }
    );
    await browser.pause(2000);
    const paidBadge = await $('//*[contains(text(), "Paid")]');
    await expect(paidBadge).toBeDisplayed();
  });

  it("TC_EJE_PP_002 - Invalid PayPal credentials", async () => {
    await products.openProduct("68c654b2f62f2bbc3db4e5a7");
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

    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[handles.length - 1]);

    const iframe = await $('iframe[name="__paypal_checkout_frame"]');
    if (await iframe.isExisting()) await browser.switchToFrame(iframe);

    await paypal.loginAndPay("hello@personal.example.com", "12345678");
    const errorEl = await $(
      'p.notification.notification-critical[role="alert"]'
    );
    await errorEl.waitForDisplayed({ timeout: 30000 });
    const errorText = await errorEl.getText();
    expect(errorText).toContain("Some of your info isn't correct");
  });

  it("TC_EJE_PP_003 - User cancels payment on PayPal page", async () => {
    await products.openProduct("68c654b2f62f2bbc3db4e5a7");
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
    await browser.pause(5000);

    const mainWindowHandle = await browser.getWindowHandle();

    const handles = await browser.getWindowHandles();
    await browser.switchToWindow(handles[handles.length - 1]);

    const iframe = await $('iframe[name="__paypal_checkout_frame"]');
    if (await iframe.isExisting()) await browser.switchToFrame(iframe);

    await paypal.loginAndPay(PAYPAL_EMAIL, PAYPAL_PASSWORD);
    await paypal.cancelPayment();
    await browser.switchToWindow(mainWindowHandle);

    const finalUrl = await browser.getUrl();
    console.log("Redirected to:", finalUrl);
    await expect(finalUrl).toContain("/order/");
  });

  it("TC_EJE_PP_004 - Payment with insufficient funds", async () => {
    await products.openProduct("68c654b2f62f2bbc3db4e5a5");
    await products.addToCart();
    await cart.updateQuantity("Cannon EOS 80D DSLR Camera", 3);
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
    if (await iframe.isExisting()) await browser.switchToFrame(iframe);

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
      { timeout: 50000 }
    );
    await browser.pause(2000);
    const notPaidBadge = await $('//*[contains(text(), "Not paid")]');
    await expect(notPaidBadge).toBeDisplayed();
  });
});
