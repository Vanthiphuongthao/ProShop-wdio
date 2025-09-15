import { LoginPage } from '../pageobjects/login.page';
import { RegisterPage } from '../pageobjects/registration.page';
import { ProfilePage } from '../pageobjects/profile.page';

describe('Change Password', () => {
    let login: LoginPage;
    let register: RegisterPage;
    let profile: ProfilePage;
    before(async () => {
        login = new LoginPage();
        register = new RegisterPage();
        profile = new ProfilePage();
    });
    describe('Success Password Change', () => {
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
        it('TC_E2E_CP_001: Change password successfully with valid inputs', async () => {
            await profile.editPassword('NewPass2@');
            await profile.editConfirmPassword('NewPass2@');
            await profile.submitUpdate();
            await expect(profile.popup).toBeDisplayed();
            await login.open();
            await login.fillEmail('user@example.com');
            await login.fillPassword('NewPass2@');
            await login.submit();
            await login.waitForRedirectToHome();
            await expect(login.homePage).toBeDisplayed();
        });
    });
    describe('New Password Validation - Does not meet requirements', () => {
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
        it('TC_E2E_CP_003: Reject change password with password less than 8 characters', async () => {
            await profile.editPassword('Ab1@cd');
            await profile.editConfirmPassword('Ab1@cd');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_004: Reject change password with missing uppercase', async () => {
            await profile.editPassword('huyen270!@');
            await profile.editConfirmPassword('huyen270!@');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_005: Reject change password with missing lowercase', async () => {
            await profile.editPassword('HUYEN270!@');
            await profile.editConfirmPassword('HUYEN270!@');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_006: Reject change password with missing number', async () => {
            await profile.editPassword('Huyen!@');
            await profile.editConfirmPassword('Huyen!@');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_007: Reject change password with missing special char', async () => {
            await profile.editPassword('Huyen270');
            await profile.editConfirmPassword('Huyen270');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_008: Reject change password with contains sequential characters', async () => {
            await profile.editPassword('Abc1234!');
            await profile.editConfirmPassword('Abc1234!');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_009: Reject change password with contains repeated characters', async () => {
            await profile.editPassword('Aaaa123!');
            await profile.editConfirmPassword('Aaaa123!');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_010: Reject change password with contains repeated characters', async () => {
            await profile.editPassword('Password1!');
            await profile.editConfirmPassword('Password1!');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_011: Reject change password with contains personal info (username/email)', async () => {
            await profile.editPassword('testuser123@');
            await profile.editConfirmPassword('testuser123@');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_CP_012: Reject change password with mismatch between new password and confirmation', async () => {
            await profile.editPassword('ValidPass2@');
            await profile.editConfirmPassword('ValidPass3@');
            await profile.submitUpdate();
            await expect(profile.popup).toBeDisplayed();
        });
        it('TC_E2E_CP_013: Reject change password with new password same as current password', async () => {
            await profile.editPassword('Pass@280');
            await profile.editConfirmPassword('Pass@280');
            const isValidPassword = await profile.invalidPassword();
            await profile.submitUpdate();
            expect(isValidPassword).toBe(false);
        });
    });
});