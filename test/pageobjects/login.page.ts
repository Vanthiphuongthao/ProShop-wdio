import { $, browser } from '@wdio/globals';
import Page from './page';

class LoginPage extends Page {
    get inputEmailAddress() { return $('#email'); }
    get inputPassword() { return $('#password'); }
    get btnSignIn() { return $('button=Sign In'); }

    public async open(): Promise<void> {
        await super.open('/login');
        await browser.waitUntil(
            async () => await this.inputEmailAddress.isDisplayed(),
            { timeout: 20000, timeoutMsg: 'Email input not visible on login page' }
        );
    }
    public async login(email: string, password: string): Promise<void> {
        await this.inputEmailAddress.setValue(email);
        await this.inputPassword.setValue(password);
        await this.btnSignIn.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()) !== 'http://localhost:3000/login',
            { timeout: 10000, timeoutMsg: 'Login failed: still on login page after 10s' }
        );
    }
}

export default new LoginPage();
