import { browser, $ } from '@wdio/globals';
import Page from './page';

export class ProfilePage extends Page {
    public get profileHeader() {
        return $('h2=User Profile');
    }
    public get infUser() {
        return $('.col-md-3');
    }
    public get infOrder() {
        return $('.col-md-9');
    }
    public get inputName() {
        return $('.form-control[type="text"]');
    }
    public get inputEmail() {
        return $('#email');
    }
    public get inputPassword() {
        return $('#password');
    }
    public get inputConfirmPassword() {
        return $('.form-control[type="password"]');
    }
    public get message() {
        return $('.Toastify');
    }
    public get homePage() {
        return $('a.navbar-brand');
    }
    public get btnUpdate() {
        return $('.btn.btn-primary');
    }
    public get popup() {
        return $('.Toastify')
    }
    public async open() {
        await super.open('/profile');
    }
    public async editName(name: string) {
        await this.inputName.setValue(name);
    }
    public async editEmail(Email: string) {
        await this.inputEmail.setValue(Email);
    }
    public async editPassword(Password: string) {
        await this.inputPassword.setValue(Password);
    }
    public async editConfirmPassword(ConfirmPassword: string) {
        await this.inputConfirmPassword.setValue(ConfirmPassword);
    }
    public async submitUpdate() {
        await this.btnUpdate.click();
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
    public async invalidName(): Promise<boolean> {
        return await browser.execute(
            (el: any) => el.checkValidity(),
            await this.inputName
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



