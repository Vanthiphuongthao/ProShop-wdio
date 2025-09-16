import { $, browser } from '@wdio/globals';

class PaypalPage {
    // selectors
    public get logInLink() { 
        return $('a[data-testid="text-log-in-link"]'); 
    }

    public get emailInput() { 
        return $('#email'); 
    }

    public get btnNext() { 
        return $('#btnNext'); 
    }

    public get passwordInput() { 
        return $('#password'); 
    }

    public get loginBtn() { 
        return $('#btnLogin'); 
    }

    public get completePurchaseBtn() {
        return $("//button[contains(., 'Complete Purchase')]");
    }

    public get errorMessage() { 
        return $('.paypal-error-message'); 
    }

    public async loginAndPay(email: string, password: string): Promise<void> {
        // Nếu có link Log In thì click
        const loginLink = await $('a[data-testid="text-log-in-link"]');
        if (await loginLink.isExisting()) {
            await loginLink.scrollIntoView();
            await loginLink.click();
        }

        // Nhập email
        if (await this.emailInput.isExisting()) {
            await this.emailInput.waitForDisplayed({ timeout: 20000 });
            await this.emailInput.setValue(email);

            // Click Next nếu có
            if (await this.btnNext.isExisting()) {
                await this.btnNext.waitForClickable({ timeout: 10000 });
                await this.btnNext.click();
            }

            // Nhập password
            await this.passwordInput.waitForDisplayed({ timeout: 20000 });
            await this.passwordInput.setValue(password);
            
            const cookieBanner = await $('div.CookieBanner_container_wrapper');
            if (await cookieBanner.isDisplayed()) {
                const acceptBtn = await $('button#acceptAllButton, button[data-testid="accept-btn"]'); 
                if (await acceptBtn.isExisting()) {
                    await acceptBtn.click();
                } else {
                    // hoặc ẩn banner bằng JS hack
                    await browser.execute(() => {
                        const banner = document.querySelector('div.CookieBanner_container_wrapper') as HTMLElement;
                        if (banner) banner.style.display = 'none';
                    });
                }
            }

            // Login
            await this.loginBtn.waitForClickable({ timeout: 20000 });
            await this.loginBtn.click();
        }
    }

    public async completePurchase(): Promise<void> {
        const completePurchaseBtn = await $("//button[contains(., 'Complete Purchase')]");

        await completePurchaseBtn.scrollIntoView();
        await completePurchaseBtn.waitForClickable({ timeout: 20000 });

        // Dùng JS click nếu normal click bị block
        try {
            await completePurchaseBtn.click();
        } catch (err) {
            console.log('Normal click failed, trying JS click');
            await browser.execute((el) => (el as HTMLElement).click(), completePurchaseBtn);
        }
    }
}
    
export default new PaypalPage();