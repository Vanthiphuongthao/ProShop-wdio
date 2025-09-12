import LoginPage from '../pageobjects/login.page.js';
import UserListPage from '../pageobjects/UserList.page.js';

describe('Admin - View User List', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await UserListPage.navigateTo();
  });

  it('TC_E2E_USER_01 - Verify user list loads successfully', async () => {
    await expect(UserListPage.table).toBeDisplayed();
  });

  it('TC_E2E_USER_02 - Verify user list columns are correct', async () => {
    const expectedHeaders = ['ID', 'NAME', 'EMAIL', 'ADMIN', 'ACTIONS'];
    const headerEls = await UserListPage.tableHeaders;

    const headers = [];
    for (const h of headerEls) {
      let text = (await h.getText()).trim();
      if (!text) text = 'ACTIONS'; // header trống map thành ACTIONS
      headers.push(text);
    }

    expect(headers).toEqual(expectedHeaders);
  });

  it('TC_E2E_USER_03 - Verify Admin users indicator', async () => {
    const rows = await UserListPage.tableRows;
    let foundAdmin = false;

    for (const row of rows) {
      const emailLink = await UserListPage.getEmailLink(row);
      const email = await emailLink.getText();

      if (email === 'admin@email.com') {
        const icon = await UserListPage.getAdminIcon(row);
        const color = await icon.getCSSProperty('color');
        foundAdmin = color.parsed.hex === '#008000'; // green
        break;
      }
    }

    expect(foundAdmin).toBe(true);
  });

  it('TC_E2E_USER_04 - Verify Non-admin users indicator', async () => {
    const rows = await UserListPage.tableRows;
    let foundNonAdmin = false;

    for (const row of rows) {
      // Try to read the admin icon color in this row
      try {
        const icon = await UserListPage.getAdminIcon(row);
        const color = await icon.getCSSProperty('color');
        const hex = (color && color.parsed && color.parsed.hex || '').toLowerCase();
        if (hex && hex !== '#008000') { // anything not green indicates non-admin (red/gray)
          foundNonAdmin = true;
          break;
        }
      } catch {}
    }

    expect(foundNonAdmin).toBe(true);
  });

it('TC_E2E_USER_05 - Verify non-admin cannot access user list', async () => {
    await browser.execute(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
    await browser.deleteCookies();
    await browser.url('/login');
    try {
      await LoginPage.login('jane@email.com', '123456', false);
    } catch (e) {}

    // Step 1: Non-admin không có Admin menu
    const isAdminMenuExisting = await LoginPage.adminMenu.isExisting();
    expect(isAdminMenuExisting).toBe(false);

    // Step 2: Nếu cố tình truy cập vào /admin/userlist => bị chặn
    await browser.url('/admin/userlist');
    await expect(browser).not.toHaveUrlContaining('/admin/userlist');
    const currentUrl = await browser.getUrl();
    const redirectedToLoginOrHome = currentUrl.includes('/login') || currentUrl.endsWith('/') || currentUrl.includes('/profile');
    expect(redirectedToLoginOrHome).toBe(true);
});
});
