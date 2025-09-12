import { RegisterPage } from '../pageobjects/registration.page';

describe('Account Registration', () => {
    let register: RegisterPage;
    before(async () => {
        register = new RegisterPage();
    });
    describe('Successful Registration', () => {
        it('TC_E2E_AR_001: Register successfully with valid email and valid password', async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.com');
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
            await register.register();
            await register.waitForRedirectToHome();
            await expect(register.homePage).toBeDisplayed();
        });
    });
    describe('Email Format Validation', () => {
        beforeEach(async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
        });
        it('TC_E2E_AR_002: Reject registration without "@" character', async () => {
            await register.fillEmail('userexample.com');
            const validationMessage = await register.errorMessage();
            const isValid = await register.invalidEmail();
            await register.register();
            expect(validationMessage).toBeDisplayed();
            expect(isValid).toBe(false);
        });
        it('TC_E2E_AR_003: Reject registration without in domain part', async () => {
            await register.fillEmail('user@');
            const validationMessage = await register.errorMessage();
            const isValid = await register.invalidEmail();
            await register.register();
            expect(validationMessage).toBeDisplayed();
            expect(isValid).toBe(false);
        });
        it('TC_E2E_AR_004: Reject registration without "." in domain part', async () => {
            await register.fillEmail('user@examplecom');
            const validationMessage = await register.errorMessage();
            const isValid = await register.invalidEmail();
            await register.register();
            expect(validationMessage).toBeDisplayed();
            expect(isValid).toBe(false);
        });
        it('TC_E2E_AR_005: Reject registration with disallowed characters', async () => {
            await register.fillEmail('user@exa mple.com');
            const validationMessage = await register.errorMessage();
            const isValid = await register.invalidEmail();
            await register.register();
            expect(validationMessage).toBeDisplayed();
            expect(isValid).toBe(false);
        });
        it('TC_E2E_AR_006: Reject registration with field left empty', async () => {
            await register.fillEmail('');
            await register.register();
            expect(register.error).toBeDisplayed();
        });
    });
    describe('Password Validation', () => {
        beforeEach(async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.com');
        });
        it('TC_E2E_AR_007: Reject registration with password less than 8 characters', async () => {
            await register.fillPassword('P@385a');
            await register.fillConfirmPassword('P@385a');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_008: Reject registration with password does not contain uppercase letters', async () => {
            await register.fillPassword('pass@280');
            await register.fillConfirmPassword('pass@280');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_009: Reject registration with password does not contain lowercase letters', async () => {
            await register.fillPassword('PASS@280');
            await register.fillConfirmPassword('PASS@280');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_010: Reject registration with password does not contain numbers', async () => {
            await register.fillPassword('Pass@word');
            await register.fillConfirmPassword('Pass@word');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_011: Reject registration with password does not contain special characters', async () => {
            await register.fillPassword('Pass280');
            await register.fillConfirmPassword('Pass280');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_012: Reject registration with password contains sequential characters', async () => {
            await register.fillPassword('Abcd@1234');
            await register.fillConfirmPassword('Abcd@1234');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_013: Reject registration with password contains repeated characters', async () => {
            await register.fillPassword('Aaaa@280');
            await register.fillConfirmPassword('Aaaa@280');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_014: Reject registration with password is in the list of common passwords', async () => {
            await register.fillPassword('iloveyou');
            await register.fillConfirmPassword('iloveyou');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_015: Reject registration with password contains name or email of user', async () => {
            await register.fillPassword('user@1234');
            await register.fillConfirmPassword('user@1234');
            const isValidPassword = await register.invalidPassword();
            await register.register();
            expect(isValidPassword).toBe(false);
        });
        it('TC_E2E_AR_016: Reject registration with password field left empty', async () => {
            await register.fillPassword('');
            await register.fillConfirmPassword('');
            await register.register();
            expect(register.error).toBeDisplayed();
        });
    });
    describe('Duplicate Email Check', () => {
        it('TC_E2E_AR_017: Reject registration with an already existing email', async () => {
            await register.open();
            await register.fillName('Test User');
            await register.fillEmail('user@example.co');
            await register.fillPassword('Pass@280');
            await register.fillConfirmPassword('Pass@280');
            await register.register();
            await expect(register.homePage).toBeDisplayed();
            await register.open();
            await register.fillName('Test User 2');
            await register.fillEmail('user@example.co');
            await register.fillPassword('validPwd');
            await register.fillConfirmPassword('validPwd');
            await register.register();
            await expect(register.error).toBeDisplayed();
        });
    });
});