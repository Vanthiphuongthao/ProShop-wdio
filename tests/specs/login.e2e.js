import LoginPage from '../pageobjects/login.page.js';

describe('Login flow', () => {
  it('should login as admin and userInfo.isAdmin true', async () => {
    await LoginPage.open();
    await LoginPage.login('admin@email.com','123456');

    // lấy userInfo
    const raw = await browser.execute(() => window.localStorage.getItem('userInfo'));
    const user = JSON.parse(raw);
    console.log('userInfo in test:', user);

    // assert có isAdmin true
    expect(user && user.isAdmin).toBe(true);

    // sau đó chờ admin menu
    await $('#adminmenu').waitForDisplayed({ timeout: 10000 });
    await expect($('#adminmenu')).toBeDisplayed();
  });
});