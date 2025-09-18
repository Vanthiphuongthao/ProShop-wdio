import { $, browser } from "@wdio/globals";
import Page from "./page";

export class PaypalPage extends Page {
  public get logInLink() {
    return $('a[data-testid="text-log-in-link"]');
  }
  public get emailInput() {
    return $("#email");
  }
  public get btnNext() {
    return $("#btnNext");
  }
  public get passwordInput() {
    return $("#password");
  }
  public get loginBtn() {
    return $("#btnLogin");
  }
  public get completePurchaseBtn() {
    return $("//button[contains(., 'Complete Purchase')]");
  }
  public get cancelButton() {
    return $('a[data-testid="cancel-link"]');
  }
  public get errorMessageEl() {
    return $('p.notification.notification-critical[role="alert"]');
  }
  public get paidBadge() {
    return $('//*[contains(text(), "Paid")]');
  }
  public get notPaidBadge() {
    return $('//*[contains(text(), "Not paid")]');
  }

  public async open(): Promise<void> {
    await super.open("/paypal"); // tuỳ theo route mock / real PayPal
  }

  public async loginAndPay(email: string, password: string): Promise<void> {
    await browser.waitUntil(async () => await this.logInLink.isDisplayed(), {
      timeout: 30000,
      timeoutMsg: "Login link not displayed after 30s",
    });

    await this.logInLink.scrollIntoView();
    await this.logInLink.waitForClickable({ timeout: 10000 });
    await this.logInLink.click();

    // login form
    await this.emailInput.waitForDisplayed({ timeout: 20000 });
    await this.emailInput.setValue(email);

    if (await this.btnNext.isExisting()) {
      await this.btnNext.waitForClickable({ timeout: 10000 });
      await this.btnNext.click();
    }

    await this.passwordInput.waitForDisplayed({ timeout: 20000 });
    await this.passwordInput.setValue(password);

    // handle cookie banner nếu có
    const cookieBanner = await $("div.CookieBanner_container_wrapper");
    if (await cookieBanner.isDisplayed()) {
      const acceptBtn = await $(
        "button#acceptAllButton, button[data-testid='accept-btn']"
      );
      if (await acceptBtn.isExisting()) {
        await acceptBtn.click();
      } else {
        await browser.execute(() => {
          const banner = document.querySelector(
            "div.CookieBanner_container_wrapper"
          );
          if (banner && banner instanceof HTMLElement) {
            banner.style.display = "none";
          }
        });
      }
    }

    await this.loginBtn.waitForClickable({ timeout: 20000 });
    await this.loginBtn.click();
  }

  public async completePurchase(): Promise<void> {
    await this.completePurchaseBtn.waitForClickable({ timeout: 20000 });
    await this.completePurchaseBtn.click();
  }

  public async cancelPayment(): Promise<void> {
    await this.cancelButton.waitForDisplayed({ timeout: 20000 });
    await this.cancelButton.click();
  }
}
