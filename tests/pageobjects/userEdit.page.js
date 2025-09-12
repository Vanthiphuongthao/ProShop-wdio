import Page from './page.js';

class UserEditPage extends Page {
  get inputName() { return $('#name'); }
  get inputEmail() { return $('#email'); }
  // Chỉ lấy nút Submit trong form chỉnh sửa user, tránh đụng nút Search trên header
  get btnUpdate() {
    return $("//form[.//input[@id='name'] or .//input[@id='email']]//button[@type='submit']");
  }
  get errorMessage() { return $('.alert-danger'); }
  get inlineError() { return $('.invalid-feedback, .is-invalid + .invalid-feedback'); }

  // Toast & fallback
  get toastBody() { return $('.Toastify__toast-body'); }
  get toastSuccess() { return $('.Toastify__toast--success'); }
  get alertSuccess() { return $('.alert-success'); }

  async editName(newName) {
    await this.inputName.waitForDisplayed({ timeout: 10000 });
    await this.inputName.clearValue();
    await this.inputName.setValue(newName);
    // blur để form “dirty”
    await browser.execute(() => document.activeElement && document.activeElement.blur());
    await this._submitAndWait();
  }

  async editEmail(email) {
    await this.inputEmail.waitForDisplayed({ timeout: 10000 });
    await this.inputEmail.clearValue();
    await this.inputEmail.setValue(email);
    await browser.execute(() => document.activeElement && document.activeElement.blur());
    await this._submitAndWait();
  }

  async submitOnly() {
    await this.btnUpdate.scrollIntoView();
    await browser.waitUntil(async () => await this.btnUpdate.isEnabled(), { timeout: 12000 });
    try {
      await this.btnUpdate.waitForClickable({ timeout: 12000 });
      await this.btnUpdate.click();
    } catch {
      await browser.execute((el) => el && el.click(), await this.btnUpdate);
    }
  }

  async _submitAndWait() {
    await this.btnUpdate.scrollIntoView();
    // Chờ nút enabled trước
    await browser.waitUntil(async () => await this.btnUpdate.isEnabled(), { timeout: 12000, timeoutMsg: 'Update button not enabled' });
    // Thử click thường, nếu không được thì dùng JS click
    try {
      await this.btnUpdate.waitForClickable({ timeout: 12000 });
      await this.btnUpdate.click();
    } catch (e) {
      await browser.execute((el) => el && el.click(), await this.btnUpdate);
    }

    // Đợi một trong các tín hiệu thành công: redirect / toast success / alert-success / bảng user list
    await browser.waitUntil(async () => {
      // 1) Redirect thành công hoặc bảng user list đã hiển thị
      try {
        const url = await browser.getUrl();
        if (url.includes('/admin/userlist')) return true;
      } catch {}
      try {
        const table = await $('div.table-responsive table');
        if (await table.isExisting()) return true;
      } catch {}

      // 2) Toastify success cụ thể
      try {
        const toastSuccessBody = await $('.Toastify__toast--success .Toastify__toast-body');
        if (await toastSuccessBody.isExisting()) {
          const text = (await toastSuccessBody.getText() || '').toLowerCase();
          if (text.includes('user updated successfully') || text.includes('updated') || text.includes('success') || text.includes('thành công')) {
            return true;
          }
        }
      } catch {}

      // 3) Bất kỳ toast nào có text thành công
      try {
        const container = await $('.Toastify__toast-container');
        if (await container.isExisting()) {
          const anyToastBody = await $('.Toastify__toast-body');
          if (await anyToastBody.isExisting()) {
            const t = (await anyToastBody.getText() || '').toLowerCase();
            if (t.includes('user updated successfully') || t.includes('updated') || t.includes('success') || t.includes('thành công')) {
              return true;
            }
          }
        }
      } catch {}

      // 4) Alert success fallback
      try {
        const alertSuccess = await $('.alert-success');
        if (await alertSuccess.isExisting()) {
          const t = (await alertSuccess.getText() || '').toLowerCase();
          if (t.includes('updated') || t.includes('success') || t.includes('thành công')) return true;
          return true;
        }
      } catch {}

      return false;
    }, { timeout: 30000, interval: 200, timeoutMsg: 'Không thấy toast/alert/redirect sau khi bấm Update' });

    // Ổn định trang nếu đã redirect về danh sách
    if ((await browser.getUrl()).includes('/admin/userlist')) {
      await $('div.table-responsive table').waitForExist({ timeout: 10000 });
    }
  }

  // giữ method này để spec cũ gọi vẫn chạy
  async waitForSuccessToast() {
  const timeout = 20000;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    // 1) Nếu có alert lỗi thì fail ngay
    if (await this.errorMessage.isExisting() && await this.errorMessage.isDisplayed()) {
      throw new Error('Có lỗi sau khi Update: ' + await this.errorMessage.getText());
    }

    // 2) Nếu đã redirect về user list -> pass
    const url = await browser.getUrl();
    if (url.includes('/admin/userlist')) return;

    // 3) Dùng util waitForToast nếu có
    try {
      await browser.waitForToast('success', 'user updated successfully', 3000);
      return;
    } catch {}

    // 4) Fallback: tự kiểm tra toast/alert success
    try {
      const toastSuccessBody = await $('.Toastify__toast--success .Toastify__toast-body');
      if (await toastSuccessBody.isExisting()) {
        const txt = (await toastSuccessBody.getText() || '').toLowerCase();
        if (txt.includes('user updated successfully') || txt.includes('updated') || txt.includes('success') || txt.includes('thành công')) {
          return;
        }
      }
    } catch {}

    try {
      if (await this.alertSuccess.isExisting()) return;
    } catch {}

    await browser.pause(150);
  }

  throw new Error('Không thấy toast/alert/redirect sau khi bấm Update');
}
  async isEmailValid() {
    return await browser.execute(() => {
      const emailInput = document.querySelector('#email');
      return emailInput ? emailInput.checkValidity() : false;
    });
  }

  async getEmailValidationMessage() {
    return await browser.execute(() => {
      const emailInput = document.querySelector('#email');
      return emailInput ? emailInput.validationMessage : '';
    });
  }

}

export default new UserEditPage();