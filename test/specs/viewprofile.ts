import { ProfilePage } from '../pageobjects/profile.page';
import { LoginPage } from '../pageobjects/login.page';

describe('View Profile', () => {
    let profile: ProfilePage;
    let login: LoginPage;
    before(() => {
        profile = new ProfilePage();
        login = new LoginPage();
    });
    describe('Successful Profile View', () => {
        beforeEach(async () => {
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('Pass@280');
            await login.submit();
            await login.waitForRedirectToHome();
        });
        it('TC_E2E_AL_001: Verify that a user can view their profile page successfully', async () => {
            await profile.goToProfile();
            await expect(profile.infUser).toBeDisplayed();
            await expect(profile.infOrder).toBeDisplayed();
        });
    });
});