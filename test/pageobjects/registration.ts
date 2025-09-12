import { browser, $ } from '@wdio/globals'
import Page from './page'

class RegisterPage extends Page {
    public get signIn() { return $('a.nav-link[href="/login"]'); }
    public get signUp() { return $("//a[text()='Register']"); }
    public get inputName() { return $('#name'); }
    public get inputEmail() { return $('#email'); }
    public get inputPassword() { return $('#password'); }
    public get inputConfirmPassword() { return $('#confirmPassword'); }
    public get btnRegister() { return $('button[type="submit"]'); }
    public get homePage() { return $('a.navbar-brand'); }
    public get passwordMismatchError() {
        return $('//div[contains(text(),"Password do not match")]');
    }

    public open() {
        return super.open('/register');
    }

    public async goToSignIn() {
        await this.signIn.click();
    }

    public async goToSignUp() {
        await this.signUp.click();
    }

    public async fillForm(name: string, email: string, password: string, confirm: string) {
        await this.inputName.setValue(name);
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        await this.inputConfirmPassword.setValue(confirm);
    }

    public async submit() {
        await this.btnRegister.click();
    }

    public async getEmailValidationMessage(): Promise<string> {
        return await browser.execute(
            (el: any) => el.validationMessage,
            await this.inputEmail
        );
    }

    public async isEmailValid(): Promise<boolean> {
        return await browser.execute(
            (el: any) => el.checkValidity(),
            await this.inputEmail
        );
    }

    public async waitForRedirectToHome() {
        await this.homePage.waitForDisplayed({ timeout: 5000 });
        await expect(browser).toHaveUrl('http://localhost:3000/');
    }
}

export default new RegisterPage();