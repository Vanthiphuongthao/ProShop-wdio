import LoginPage from '../pageobjects/login.page.js';
import UserListPage from '../pageobjects/UserList.page.js';
import UserEditPage from '../pageobjects/UserEdit.page.js';

describe('Admin - Edit User Role', () => {
  beforeEach(async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com', '123456');
    await UserListPage.navigateTo();
  });

  it('TC_E2E_USER_015 - Edit user role: assign Admin to John successfully', async () => {
    // Giả định row 2 là John (non-admin)
    await UserListPage.clickEditByIndex(2);
    await expect(browser).toHaveUrlContaining('/admin/user/');

    const roleCheckbox = await $('#isadmin');
    const wasChecked = await roleCheckbox.isSelected();

    if (!wasChecked) {
      await roleCheckbox.click();
    }

    await UserEditPage.submitOnly();
    await UserEditPage.waitForSuccessToast();

    // Quay lại User List để verify John là Admin
    await UserListPage.navigateTo();
    const row = (await UserListPage.tableRows)[1]; // row 2 trong bảng
    const icon = await UserListPage.getAdminIcon(row);
    const color = await icon.getCSSProperty('color');
    expect(color.parsed.hex).toBe('#008000'); // xanh = Admin
  });

it('TC_E2E_USER_016 - Prevent editing own role', async () => {
  const firstRow = await UserListPage.firstRow; // admin user row

  // Kiểm tra admin không có nút Edit
  const editBtn = await UserListPage.getEditButton(firstRow);
  const exists = await editBtn.isExisting();

  expect(exists).toBe(false); // admin không thể tự sửa role
});
});
