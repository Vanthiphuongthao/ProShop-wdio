class LoginPage {
    // Các selector của trang login
    get emailInput() {
        return $('#email'); 
    }

    get passwordInput() {
        return $('#password'); 
    }

    get btnSignIn() {
        return $('button=Sign In'); 
    }

    // Mở trang login
    async open() {
        await browser.url('http://localhost:3000/login');
        console.log('Current URL:', await browser.getUrl());
        
        await browser.waitUntil(
            async () => (await this.emailInput.isExisting()) && (await this.emailInput.isDisplayed()),
            {
                timeout: 20000,
                timeoutMsg: 'Email input not visible on login page'
            }
        );
}


    // Thực hiện đăng nhập
    async login(email, password) {
        await this.emailInput.waitForDisplayed({ timeout: 10000 });
        await this.emailInput.setValue(email);

        await this.passwordInput.waitForDisplayed({ timeout: 10000 });
        await this.passwordInput.setValue(password);

        await this.btnSignIn.waitForClickable({ timeout: 10000 });
        await this.btnSignIn.click();
        await browser.waitUntil(
        async () => (await browser.getUrl()) !== 'http://localhost:3000/login',
        {
            timeout: 10000,
            timeoutMsg: 'Login failed: still on login page after 10s'
        }
    );
}
}

module.exports = new LoginPage();
