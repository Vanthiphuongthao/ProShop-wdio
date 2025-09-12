import RegisterPage from '.../pageobjects/registration.ts';

describe('Account Registration', () => {
  it('Should register successfully and redirect to homepage', async () => {
    await RegisterPage.open();
    await RegisterPage.fillForm(
      'Test User',
      `user@example.com`,
      'Pass@280',
      'Pass@280'
    );
    await RegisterPage.submit();
    await RegisterPage.waitForRedirectToHome();
    await expect(RegisterPage.homePage).toBeDisplayed();
  });
});