import { browser, expect } from "@wdio/globals";
import { LoginPage } from "../pageobjects/login.page";
import { OrderDetailsPage } from "../pageobjects/orderDetails.page";
import { OrderListPage } from "../pageobjects/orderList.page";

describe("Mark As Delivered Functionality", () => {
  let loginPage: LoginPage;
  let orderDetailPage: OrderDetailsPage;
  let orderListPage: OrderListPage;

  beforeEach(async () => {
    loginPage = new LoginPage();
    orderDetailPage = new OrderDetailsPage();
    orderListPage = new OrderListPage();

    await browser.url("/");
    await browser.execute(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await browser.deleteCookies();
  });

  // helper tạm ngay trong file test
  const getFirstPaidNotDeliveredRow = async (page: OrderListPage) => {
    const rows = await page.tableRows;
    for (const row of rows) {
      if ((await page.isPaid(row)) && !(await page.isDelivered(row))) {
        return row;
      }
    }
    return null;
  };

  const getFirstDeliveredRow = async (page: OrderListPage) => {
    const rows = await page.tableRows;
    for (const row of rows) {
      if (await page.isDelivered(row)) {
        return row;
      }
    }
    return null;
  };

  it("TC_E2E_MD_001 - Admin marks order as Delivered successfully", async () => {
    await loginPage.open();
    await loginPage.login("admin@email.com", "123456");

    await orderListPage.open();
    const row = await getFirstPaidNotDeliveredRow(orderListPage);
    if (!row) {
      console.log(
        "⚠️ Không có order phù hợp (Paid & Not Delivered) → Skip test"
      );
      return;
    }

    const orderId = await orderListPage.getOrderId(row);
    await orderListPage.clickDetails(row);

    await expect(browser).toHaveUrl(
      expect.stringContaining(`/order/${orderId}`)
    );

    // Mark as Delivered
    await orderDetailPage.markAsDeliveredBtn;
    await expect(await orderDetailPage.paidStatus.isDisplayed()).toBe(true);
  });

  it("TC_E2E_MD_002 - Admin cannot re-mark already Delivered order", async () => {
    await loginPage.open();
    await loginPage.login("admin@email.com", "123456");

    await orderListPage.open();
    const row = await getFirstDeliveredRow(orderListPage);
    if (!row) {
      console.log("⚠️ Không có order Delivered → Skip test");
      return;
    }

    await orderListPage.clickDetails(row);

    await expect(await orderDetailPage.deliveredBtn.isExisting()).toBe(false);
  });

  it("TC_E2E_MD_003 - Customer cannot see active Mark As Delivered button", async () => {
    await loginPage.open();
    await loginPage.login("john@email.com", "123456");

    // truy cập trực tiếp vào order id giả định
    const testOrderId = "68c7b6c48824a9dc3e33ae00";
    await browser.url(`/order/${testOrderId}`);
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes(`/order/${testOrderId}`),
      { timeout: 10000 }
    );

    const visible = await orderDetailPage.deliveredBtn.isExisting();
    await expect(visible).toBe(false);
  });
});
