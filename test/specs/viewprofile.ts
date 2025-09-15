import { LoginPage } from '../pageobjects/login.page';
import { RegisterPage } from '../pageobjects/registration.page';
import { ProfilePage } from '../pageobjects/profile.page';

describe('Account Registration', () => {
    let login: LoginPage;
    let register: RegisterPage;
    let profile: ProfilePage;
    before(async () => {
        login = new LoginPage();
        register = new RegisterPage();
        profile = new ProfilePage();
        await register.open();
        await register.fillName('Test User');
        await register.fillEmail('user@example.com');
        await register.fillPassword('Pass@280');
        await register.fillConfirmPassword('Pass@280');
        await register.register();
        await register.waitForRedirectToHome();
        await login.open();
        await login.fillEmail('user@example.com');
        await login.fillPassword('Pass@280');
        await login.submit();
        await login.waitForRedirectToHome();
    });
    describe('Successful Profile View', () => {
        it('TC_E2E_VP_001: Verify that a user can view their profile page successfully', async () => {
            await profile.open();
            expect(profile.infUser).toBeDisplayed();
            expect(profile.infOrder).toBeDisplayed();
        });
    });
    describe('Access Restriction for Non-Logged-In Users', () => {
        it('TC_E2E_VP_004: Block profile access when not logged in', async () => {
            await login.open();
            await profile.open();
            await expect(browser).toHaveUrl('http://localhost:3000/login');
        });
    });
});