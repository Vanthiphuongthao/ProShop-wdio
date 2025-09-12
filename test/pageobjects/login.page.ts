import { browser, $ } from '@wdio/globals';
import Page from './page';

export class LoginPage extends Page {
    public get signIn() {
        return $('a.nav-link[href="/login"]');
    }
    public get inputEmailAddress() {
        return $('#email');
    }
    public get inputPassword() {
        return $('#password');
    }
    public get btnSignIn() {
        return $('button[type="submit"]');
    }
    public get homePage() {
        return $('a.navbar-brand');
    }
    public get error() {
        return $('.Toastify')
    }
    public async open() {
        await super.open('/login');
    }
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
        await this.homePage.waitForDisplayed({ timeout: 5000 });
        await expect(browser).toHaveUrl('http://localhost:3000/');
    }
}

