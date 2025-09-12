import { browser, $ } from '@wdio/globals';
import Page from './page';

export class RegisterPage extends Page {
    public get signIn() {
        return $('a.nav-link[href="/login"]');
    }
    public get signUp() {
        return $("//a[text()='Register']");
    }
    public get inputName() {
        return $('#name');
    }
    public get inputEmail() {
        return $('#email');
    }
    public get inputPassword() {
        return $('#password');
    }
    public get inputConfirmPassword() {
        return $('#confirmPassword');
    }
    public get btnRegister() {
        return $('button[type="submit"]');
    }
    public get homePage() {
        return $('a.navbar-brand');
    }
    public get error() {
        return $('.Toastify')
    }
    public async open() {
        await super.open('/register');
    }
    public async goToSignIn() {
        await this.signIn.click();
    }
    public async goToSignUp() {
        await this.signUp.click();
    }
    public async fillName(name: string) {
        await this.inputName.setValue(name);
    }
    public async fillEmail(email: string) {
        await this.inputEmail.setValue(email);
    }
    public async fillPassword(password: string) {
        await this.inputPassword.setValue(password);
    }
    public async fillConfirmPassword(confirm: string) {
        await this.inputConfirmPassword.setValue(confirm);
    }
    public async register() {
        await this.btnRegister.click();
    }
    public async errorMessage(): Promise<string> {
        return await browser.execute(
            (el: any) => el.validationMessage,
            await this.inputEmail
        );
    }
    public async invalidEmail(): Promise<boolean> {
        return await browser.execute(
            (el: any) => el.checkValidity(),
            await this.inputEmail
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
