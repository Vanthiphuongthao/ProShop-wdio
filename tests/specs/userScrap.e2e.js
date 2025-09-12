import LoginPage from '../pageobjects/login.page.js';
import UserListPage from '../pageobjects/UserList.page.js';

describe('Admin - Delete User', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await UserListPage.navigateTo();
  });

  it('TC_E2E_USER_017 - Cancel delete keeps user row', async () => {
  // Find the row by text instead of index
  const janeRow = await UserListPage.findRowByText('Jane'); // implement this helper
  const delBtn = await UserListPage.getDeleteButton(janeRow);

  await browser.execute(() => {
    window._realConfirm = window.confirm;
    window.confirm = () => false; // cancel
  });

  await delBtn.click();

  // Give the UI a moment to settle, but rely on an assertion, not just pause
  await browser.pause(200);
  // Verify Jane still exists
  const janeStillThere = await UserListPage.rowExistsByText('Jane');
  expect(janeStillThere).toBe(true);

  await browser.execute(() => { if (window._realConfirm) window.confirm = window._realConfirm; });
});

  it('TC_E2E_USER_018 - Confirm delete removes user row', async () => {
  const janeRow = await UserListPage.findRowByText('Jane');
  const delBtn = await UserListPage.getDeleteButton(janeRow);

  await browser.execute(() => {
    window._realConfirm = window.confirm;
    window.confirm = () => true; // confirm OK
  });

  await delBtn.click();

  // Prefer a deterministic wait: success toast or server alert
  // If you already have a toast helper:
  // await browser.waitForToast('success', 'User removed');

  // Fallback: wait until Jane is gone from the table
  await browser.waitUntil(
    async () => !(await UserListPage.rowExistsByText('Jane')),
    { timeout: 3000, interval: 150, timeoutMsg: 'Jane row still visible after delete' }
  );

  // Reload or navigate to force a fresh fetch from the backend so we confirm DB persisted change
  await browser.refresh();
  await UserListPage.waitForLoaded(); // implement: waits for table to finish loading

  const janeExistsAfterReload = await UserListPage.rowExistsByText('Jane');
  expect(janeExistsAfterReload).toBe(false);

  await browser.execute(() => { if (window._realConfirm) window.confirm = window._realConfirm; });
});

  it('TC_E2E_USER_019 - Prevent deleting self (Admin)', async () => {
    const firstRow = await UserListPage.firstRow; // Admin User
    const delBtn = await UserListPage.getDeleteButton(firstRow);
    const exists = await delBtn.isExisting();
    expect(exists).toBe(false); // admin không có nút delete
  });
});