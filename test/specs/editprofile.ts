import { LoginPage } from '../pageobjects/login.page';
import { RegisterPage } from '../pageobjects/registration.page';
import { ProfilePage } from '../pageobjects/profile.page';

describe('Edit Profile', () => {
    let login: LoginPage;
    let register: RegisterPage;
    let profile: ProfilePage;
    before(async () => {
        login = new LoginPage();
        register = new RegisterPage();
        profile = new ProfilePage();
    });
    describe('Successful Profile View', () => {
        beforeEach(async () => {
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
            await profile.open();
            await profile.editName('John Wolverine');
        });
        it('TC_E2E_EP_001: Successful Profile Edit', async () => {
            await profile.editEmail('johnjr@example.com');
            await profile.submitUpdate();
            await expect(profile.popup).toBeDisplayed();
        });
    });
    describe('Input Validation - Invalid Email Format', () => {
        beforeEach(async () => {
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
            await profile.open();
            await profile.editName('John Wolverine');
        });
        it('TC_E2E_EP_002: Reject edit with invalid email format (missing @)', async () => {
            await profile.editEmail('johndoeexample.com');
            const validationMessage = await profile.errorMessage();
            const isValidEmail = await profile.invalidEmail();
            await profile.submitUpdate();
            expect(validationMessage).toBeDisplayed();
            expect(isValidEmail).toBe(false);
        });
        it('TC_E2E_EP_003: Reject edit with invalid email format (Disallowed Characters)', async () => {
            await profile.editEmail('john#doe@example.com');
            const validationMessage = await profile.errorMessage();
            const isValidEmail = await profile.invalidEmail();
            await profile.submitUpdate();
            expect(validationMessage).toBeDisplayed();
            expect(isValidEmail).toBe(false);
        });
        it('TC_E2E_EP_004: Reject edit with invalid email format (with Multiple @)', async () => {
            await profile.editEmail('john@@@example.com');
            const validationMessage = await profile.errorMessage();
            const isValidEmail = await profile.invalidEmail();
            await profile.submitUpdate();
            expect(validationMessage).toBeDisplayed();
            expect(isValidEmail).toBe(false);
        });
    });
    describe('Input Validation - Required Fields', () => {
        beforeEach(async () => {
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
            await profile.open();
        });
        it('TC_E2E_EP_005: Required Field Missing – Name Blank', async () => {
            await profile.editName('');
            await profile.editEmail('johny@example.com');
            const isValidName = await profile.invalidName();
            await profile.submitUpdate();
            expect(isValidName).toBe(false);
        });
        it('TC_E2E_EP_006: Required Field Missing – Email Blank', async () => {
            await profile.editName('John Wolverine');
            await profile.editEmail('');
            const isValidEmail = await profile.invalidEmail();
            await profile.submitUpdate();
            expect(isValidEmail).toBe(false);
        });
         it('TC_E2E_EP_007: Verify Non-Editable Password Fields', async () => {
            await profile.submitUpdate();
            await expect(profile.popup).not.toBeDisplayed();
        });
        it('TC_E2E_EP_008: Update Button Disabled When No Changes', async () => {
            await profile.editPassword(' TestPass1@');
            await profile.editConfirmPassword(' TestPass1@');
            await profile.submitUpdate();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword(' TestPass1@');
            await login.submit();
            await login.waitForRedirectToHome();
            await expect(login.homePage).not.toBeDisplayed();
        });
    });
});