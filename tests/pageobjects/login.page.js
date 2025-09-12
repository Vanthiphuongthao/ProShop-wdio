import Page from './page.js';

class LoginPage extends Page {
  get inputEmail() { return $('#email'); }
  get inputPassword() { return $('#password'); }
  // Prefer the submit button within the login form to avoid header buttons
  get btnSubmit() { return $("//form[.//input[@id='email'] and .//input[@id='password']]//button[@type='submit' or normalize-space(text())='Sign In']"); }

  // Các selector có thể khác nhau tuỳ giao diện
  get adminById() { return $('#adminmenu'); } 
  // Alias để spec có thể dùng LoginPage.adminMenu
  get adminMenu() { return this.adminById; }
  get adminExact() { return $("//a[normalize-space(text())='Admin']"); }
  get usersLink() { return $("//a[contains(@href,'/admin/userlist')]"); } // fallback nếu không có #adminmenu

  async open() {
    await super.open('/login');
  }

async login(email, password, expectAdminMenu = true) {
  // 1) Nếu chỉ khi mong đợi menu admin, mới bỏ qua khi đã đăng nhập sẵn
  if (expectAdminMenu) {
    if (
      (await this.adminById.isExisting()) ||
      (await this.adminExact.isExisting()) ||
      (await this.usersLink.isExisting())
    ) {
      return;
    }
  }

  // 2) Đảm bảo đang ở /login
  if (!(await browser.getUrl()).includes('/login')) {
    await this.open();
  }

  // 3) Chờ 1 trong 2: (a) form login xuất hiện hoặc (b) dấu hiệu admin (redirect)
  await browser.waitUntil(
    async () =>
      (await this.inputEmail.isExisting()) ||
      (await this.adminById.isExisting()) ||
      (await this.adminExact.isExisting()) ||
      (await this.usersLink.isExisting()),
    { timeout: 10000, timeoutMsg: 'Neither login form nor admin markers appeared' }
  );

  // 4) Nếu không còn form (đã bị redirect) thì coi như đã login
  if (!(await this.inputEmail.isExisting())) {
    if (expectAdminMenu) {
      await browser.waitUntil(
        async () =>
          (await this.adminById.isExisting()) ||
          (await this.adminExact.isExisting()) ||
          (await this.usersLink.isExisting()),
        { timeout: 10000, timeoutMsg: 'Admin menu not visible after login redirect' }
      );
    }
    return;
  }

  // 5) Thực sự gõ & submit form
  await this.inputEmail.waitForDisplayed({ timeout: 10000 });
  await this.inputEmail.clearValue();
  await this.inputEmail.setValue(email);
  await this.inputPassword.clearValue();
  await this.inputPassword.setValue(password);
  await this.btnSubmit.waitForClickable({ timeout: 10000 });
  await this.btnSubmit.click();

  // 6) Rời khỏi /login
  await browser.waitUntil(
    async () => !(await browser.getUrl()).includes('/login'),
    { timeout: 10000, timeoutMsg: 'Did not navigate away from /login after login' }
  );

  // 7) Xác nhận đã có menu admin (nếu cần)
  if (expectAdminMenu) {
    await browser.waitUntil(
      async () =>
        (await this.adminById.isExisting()) ||
        (await this.adminExact.isExisting()) ||
        (await this.usersLink.isExisting()),
      { timeout: 10000, timeoutMsg: 'Admin menu not visible after login' }
    );
  }
}
}
export default new LoginPage();