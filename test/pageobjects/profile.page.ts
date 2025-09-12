import { browser, $ } from '@wdio/globals';
import Page from './page';

export class ProfilePage extends Page {
    public get btnDrop() {
        return $('#username');
    }
    public get profileLink() {
        return $('a[href="/profile"]');
    }
    public get profileHeader() {
        return $('h2=User Profile');
    }
    public get infUser() {
        return $('.my-2');
    }
    public get infOrder() {
        return $('.col-md-9');
    }
    public get message() {
        return $('.Toastify');
    }
    public get btnUpdate() {
        return $('button[type="submit"]');
    }
    public get homePage() {
        return $('a.navbar-brand');
    }
    public async open() {
        await super.open('/profile');
    }
    // public async goToProfileLink() {
    //     await this.btnDrop.click();
    // }
    // public async goToProfile() {
    //     await this.profileLink.click();
    // }
     public async goToProfile() {
        await this.btnDrop.click();
        await this.profileLink.waitForDisplayed({ timeout: 5000 });
        await this.profileLink.click();
    }
    public async update() {
        await this.btnUpdate.click();
    }
    public async waitForRedirectToHome() {
        await this.homePage.waitForDisplayed({ timeout: 5000 });
        await expect(browser).toHaveUrl('http://localhost:3000/');
    }
}



