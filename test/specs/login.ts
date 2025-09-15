import { LoginPage } from '../pageobjects/login.page';
import { RegisterPage } from '../pageobjects/registration.page';
// import { ProfilePage } from '../pageobjects/profile.page';

describe('Account Registration', () => {
    let login: LoginPage;
    let register: RegisterPage;
    // let profile: ProfilePage;
    before(async () => {
        login = new LoginPage();
        register = new RegisterPage();
        // profile = new ProfilePage();
    });
    describe('Successful Login', () => {
        it('TC_E2E_AL_001: Login successfully with valid email and valid password', async () => {
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
            await expect(login.homePage).toBeDisplayed();
        });
    });
    describe('Invalid Email Format', () => {
        beforeEach(async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.com');
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillPassword('Pass@280');
        });
        it('TC_E2E_AL_002: Reject login with invalid email format (missing @)', async () => {
            await login.fillEmail('userexample.com');
            const validationMessage = await login.errorMessage();
            const isValid = await login.invalidEmail();
            await login.submit();
            expect(validationMessage).toBeDisplayed();
            await expect(isValid).toBe(false);
        });
        it('TC_E2E_AL_003: Reject login with invalid email format (Disallowed Characters)', async () => {
            await login.fillEmail('user@exa mple.com');
            const validationMessage = await login.errorMessage();
            const isValid = await login.invalidEmail();
            await login.submit();
            expect(validationMessage).toBeDisplayed();
            expect(isValid).toBe(false);
        });
        it('TC_E2E_AL_004: Reject login with email is not registered in the system', async () => {
            await login.fillEmail('nonuser@example.com');
            await login.submit();
            await expect(login.error).toBeDisplayed();
        });
    });
    describe('Empty Fields', () => {
        beforeEach(async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.com');
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
        });
        it('TC_E2E_AL_005: Reject login with empty fields (both blank)', async () => {
            await login.fillEmail('');
            await login.fillPassword('');
            await login.submit();
            await expect(login.error).toBeDisplayed();
        });
        it('TC_E2E_AL_006: Reject login with empty email field', async () => {
            await login.fillEmail('');
            await login.fillPassword('Pass@280');
            await login.submit();
            expect(login.error).toBeDisplayed();
        });
        it('TC_E2E_AL_007: Reject login with empty password field', async () => {
            await login.fillEmail('user@example.com');
            await login.fillPassword('');
            await login.submit();
            await expect(login.error).toBeDisplayed();
        });
    });
    describe('Incorrect Email or Password', () => {
        beforeEach(async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.com');
        });
        it('TC_E2E_AL_008: Reject login with incorrect password', async () => {
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com')
            await login.fillPassword('WrongPass1@');
            await login.submit();
            await expect(login.error).toBeDisplayed();
        });
        it('TC_E2E_AL_009: Reject login with password too short', async () => {
            await register.fillPassword('P@ss1');
            await register.fillConfirmPassword('P@ss1');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('P@ss1');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_010: Reject login with password Missing Uppercase', async () => {
            await register.fillPassword('password1@');
            await register.fillConfirmPassword('password1@');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('password1@');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);

        });
        it('TC_E2E_AL_011: Reject login with password Missing Lowercase', async () => {
            await register.fillPassword('PASSWORD1@');
            await register.fillConfirmPassword('PASSWORD1@');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('PASSWORD1@');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_012: Reject login with password Missing Number', async () => {
            await register.fillPassword('PASSWORD@');
            await register.fillConfirmPassword('PASSWORD@');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('PASSWORD@');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_013: Reject login with password Missing Special Character', async () => {
            await register.fillPassword('Password1');
            await register.fillConfirmPassword('Password1');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('Password1');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_014: Reject login with password Contains Sequential Characters', async () => {
            await register.fillPassword('Abcd1234!');
            await register.fillConfirmPassword('Abcd1234!');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('Abcd1234!');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_015: Reject login with password Contains Repeated Characters', async () => {
            await register.fillPassword('Aaaa111!');
            await register.fillConfirmPassword('Aaaa111!');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('Aaaa1111!');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_016: Reject login with Common Password Used', async () => {
            await register.fillPassword('Password123!');
            await register.fillConfirmPassword('Password123!');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('Password123!');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AL_017: Reject login with password Contains Personal Info', async () => {
            await register.fillPassword('user@1234');
            await register.fillConfirmPassword('user@1234');
            await register.register();
            await register.waitForRedirectToHome();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('user@1234');
            const isValidPassword = await login.invalidPassword();
            await login.submit();
            expect(isValidPassword).toBe(false);
        });
    });
});