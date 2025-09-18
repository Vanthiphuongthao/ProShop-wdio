import { browser, $ } from "@wdio/globals";
import Page from "./page";

export class LoginPage extends Page {
  public get signIn() {
    return $('a.nav-link[href="/login"]');
  }
  public get inputEmailAddress() {
    return $("#email");
  }
  public get inputPassword() {
    return $("#password");
  }
  public get btnSignIn() {
    return $('button[type="submit"]');
  }
  public get homePage() {
    return $("a.navbar-brand");
  }
  public get error() {
    return $(".Toastify");
  }
  public async open() {
    await super.open("/login");
    //bsung waitUntil từ feature-An
    await browser.waitUntil(
      async () => await this.inputEmailAddress.isDisplayed(),
      { timeout: 20000, timeoutMsg: "Email input not visible on login page" }
    );
  }
  //

  public async goToSignIn() {
    await this.signIn.click();
  }
  public async fillEmail(email: string) {
    await this.inputEmailAddress.setValue(email);
  }
  public async fillPassword(password: string) {
    await this.inputPassword.setValue(password);
  }
  public async submit() {
    await this.btnSignIn.click();
  }

  //Gom lai thanh ham login (feature-An)
  public async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
    await browser.waitUntil(
      async () => (await browser.getUrl()) !== "http://localhost:3000/login",
      {
        timeout: 10000,
        timeoutMsg: "Login failed: still on login page after 10s",
      }
    );
  }
  //

  public async errorMessage(): Promise<string> {
    return await browser.execute(
      (el: any) => el.validationMessage,
      await this.inputEmailAddress
    );
  }
  public async invalidEmail(): Promise<boolean> {
    return await browser.execute(
      (el: any) => el.checkValidity(),
      await this.inputEmailAddress
    );
  }

  public async invalidPassword(): Promise<boolean> {
    return await browser.execute(
      (el: any) => el.checkValidity(),
      await this.inputPassword
    );
  }
  public async waitForRedirectToHome() {
    await this.homePage.waitForDisplayed({ timeout: 10000 });
    await expect(browser).toHaveUrl("http://localhost:3000/");
  }
}
