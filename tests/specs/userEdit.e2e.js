import LoginPage from '../pageobjects/login.page.js';
import UserListPage from '../pageobjects/UserList.page.js';
import UserEditPage from '../pageobjects/UserEdit.page.js';

describe('Admin - Edit User Flow (Happy Cases)', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await UserListPage.navigateTo();
  });

it('TC_E2E_USER_09 - Edit user name successfully', async () => {
  await UserListPage.clickEditByIndex(2);
  await expect(browser).toHaveUrlContaining('/admin/user/');

  await UserEditPage.editName('John Updated');

  // chờ redirect về user list
  await expect(browser).toHaveUrlContaining('/admin/userlist');

  // chờ toast success
  await browser.waitForToast('success', 'user updated successfully');

  // verify dữ liệu trong bảng
  const updatedName = await $('table tbody tr:nth-child(2) td:nth-child(2)').getText();
  await expect(updatedName).toEqual('John Updated');
});

describe('Admin - Edit User Flow (Edge/Negative Cases)', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await UserListPage.navigateTo();
    await UserListPage.clickEditByIndex(2);
    await expect(browser).toHaveUrlContaining('/admin/user/');
  });

  it('TC_E2E_USER_011 - Prevent empty name submission', async () => {
    await UserEditPage.inputName.waitForDisplayed({ timeout: 10000 });
    await UserEditPage.inputName.clearValue();
    await browser.execute(() => document.activeElement && document.activeElement.blur());
    await UserEditPage.submitOnly();

    // Expect inline validation or alert-danger
    const hasInlineError = await UserEditPage.inlineError.isExisting();
    const hasAlertError = await UserEditPage.errorMessage.isExisting();
    expect(hasInlineError || hasAlertError).toBe(true);
  });

  it('TC_E2E_USER_012 - Prevent invalid email format', async () => {
    await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
    await UserEditPage.inputEmail.clearValue();
    await UserEditPage.inputEmail.setValue('not-an-email');
    await browser.execute(() => document.activeElement && document.activeElement.blur());
    await UserEditPage.submitOnly();
    await browser.pause(200);
    

    const hasInlineError = await UserEditPage.inlineError.isExisting();
    const hasAlertError = await UserEditPage.errorMessage.isExisting();
    const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');
    expect(hasInlineError || hasAlertError || stayedOnEdit).toBe(true);
  });
  it('TC_E2E_USER_12a - Reject email without "@"', async () => {
  await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
  await UserEditPage.inputEmail.clearValue();
  await UserEditPage.inputEmail.setValue('john.com'); // thiếu @
  await browser.execute(() => document.activeElement && document.activeElement.blur());
  await UserEditPage.submitOnly();
  await browser.pause(200);
    

  const hasInlineError = await UserEditPage.inlineError.isExisting();
  const hasAlertError = await UserEditPage.errorMessage.isExisting();
  const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');
  expect(hasInlineError || hasAlertError || stayedOnEdit).toBe(true);
});

it('TC_E2E_USER_12b - Reject email without domain', async () => {
  await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
  await UserEditPage.inputEmail.clearValue();
  await UserEditPage.inputEmail.setValue('user@'); // thiếu domain
  await browser.execute(() => document.activeElement && document.activeElement.blur());
  await UserEditPage.submitOnly();
  await browser.pause(200);
    

  const hasInlineError = await UserEditPage.inlineError.isExisting();
  const hasAlertError = await UserEditPage.errorMessage.isExisting();
  const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');
  expect(hasInlineError || hasAlertError || stayedOnEdit).toBe(true);
});

it('TC_E2E_USER_12c - Reject email without dot in domain', async () => {
  await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
  await UserEditPage.inputEmail.clearValue();
  await UserEditPage.inputEmail.setValue('user@domain'); // missing dot
  // Force blur to trigger client-side validation
  await $('#name').click(); // or any other field to blur email

  await UserEditPage.submitOnly();

  // Observation window to let validation/render happen
  await browser.pause(300);

  const saveBtn = await UserEditPage.saveButton; // adjust if different
  const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');

  // Prefer waiting for a stable condition instead of immediate existence check
  const validationVisible = await browser.waitUntil(
    async () => (await UserEditPage.inlineError.isDisplayed()) || (await UserEditPage.errorMessage.isDisplayed()),
    { timeout: 1200, interval: 100, timeoutMsg: 'No validation shown' }
  ).catch(() => false);

  // Button disabled is another acceptable prevention signal
  const buttonDisabled = await saveBtn.isEnabled().then(v => !v).catch(() => false);

  // No success signal within a short window
  await browser.pause(200);
  const successToastExists = await $('.toast-success').isExisting();

  expect(validationVisible || buttonDisabled || stayedOnEdit).toBe(true);
  expect(successToastExists).toBe(false);
});

it('TC_E2E_USER_12d - Reject email with invalid characters', async () => {
  await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
  await UserEditPage.inputEmail.clearValue();
  await UserEditPage.inputEmail.setValue('user@domain,com'); // ký tự không hợp lệ
  await browser.execute(() => document.activeElement && document.activeElement.blur());
  await UserEditPage.submitOnly();
  await browser.pause(200);
    

  const hasInlineError = await UserEditPage.inlineError.isExisting();
  const hasAlertError = await UserEditPage.errorMessage.isExisting();
  const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');
  expect(hasInlineError || hasAlertError || stayedOnEdit).toBe(true);
});


it('TC_E2E_USER_13 - No-change submit should not redirect', async () => {
  const urlBefore = await browser.getUrl();
  await UserEditPage.submitOnly();

  // Observe for a brief period for any redirect attempt
  await browser.waitUntil(
    async () => (await browser.getUrl()).includes('/admin/user/'),
    { timeout: 800, interval: 100 }
  ).catch(() => {}); // we only care it did not leave

  const urlAfter = await browser.getUrl();

  // Extra guard: ensure no success toast appeared
  await browser.pause(200);
  const successToastExists = await $('.toast-success').isExisting();

  expect(urlAfter.includes('/admin/user/')).toBe(true);
  expect(successToastExists).toBe(false);
});
});

  it('TC_E2E_USER_10 - Edit user email successfully', async () => {
    await UserListPage.clickEditByIndex(2); // row 2 → John Doe
    await expect(browser).toHaveUrlContaining('/admin/user/');

    // Edit Email
    await UserEditPage.editEmail('newjohn@email.com');
    await UserEditPage.waitForSuccessToast();

    // Back to User List & verify
    await UserListPage.navigateTo();
    const updatedEmail = await $('table tbody tr:nth-child(2) td:nth-child(3)').getText();
    await expect(updatedEmail).toEqual('newjohn@email.com');
  });
it('TC_E2E_USER_014 - Prevent updating to an email already in use', async () => {
  // Precondition: there exists another user with email "jane@email.com"
  // Navigate to edit page is already done in beforeEach of this describe

  await UserEditPage.inputEmail.waitForDisplayed({ timeout: 10000 });
  await UserEditPage.inputEmail.clearValue();
  await UserEditPage.inputEmail.setValue('jane@email.com');

  // Trigger validation and try to submit
  await browser.execute(() => document.activeElement && document.activeElement.blur());
  await UserEditPage.submitOnly();

  // Expected behavior: block submission
  // Accept either inline field error or server-level alert message,
  // and ensure we remain on the edit page with no success toast.
  const hasInlineError = await UserEditPage.inlineError.isExisting();
  const hasAlertError = await UserEditPage.errorMessage.isExisting();
  const stayedOnEdit = (await browser.getUrl()).includes('/admin/user/');
  await expect($('.toast-success')).not.toBeExisting();

  expect(hasInlineError || hasAlertError || stayedOnEdit).toBe(true);

  // Optional (if you expose toast-error or specific status mapping):
  // await expect($('.toast-error')).toBeExisting();
  // Optional network-level assertion if you track it: expect status 400/409
});

});

