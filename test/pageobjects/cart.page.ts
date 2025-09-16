import { $$, $, browser } from '@wdio/globals';
import ShippingPage from './shipping.page'; // Assuming this file is also converted to TS

class CartPage {
  // Lấy tất cả sản phẩm trong giỏ
  public get cartProducts() {
    return $$('//div[@class="row"]//a');
  }

  public get cartItems() {
    return $$('.list-group-item');
  }

  // Trả về đúng product theo tên
  public getProduct(productName: string) {
    return $(`//a[contains(., "${productName}")]`);
  }

  public getProductQuantity(productName: string) {
    return $(`//a[contains(., "${productName}")]/ancestor::div[@class="row"]//select`);
  }

  public async updateQuantity(productName: string, qty: number): Promise<void> {
    const quantitySelect = await this.getProductQuantity(productName);
    await quantitySelect.waitForDisplayed({ timeout: 5000 });

    // Nếu qty <=0 thì giữ 1
    if (qty <= 0) qty = 1;

    // Kiểm tra dropdown có option trước khi chọn
    const option = await quantitySelect.$(`option[value="${qty}"]`);
    const exists = await option.isExisting();
    if (!exists) {
      console.warn(`Option value=${qty} không tồn tại, giữ nguyên.`);
      return;
    }

    await quantitySelect.selectByAttribute('value', String(qty));
  }

  public get removeBtns() {
    return $$('button.remove');
  }

  public async removeProductByName(productName: string): Promise<void> {
    // Tìm div của product dựa vào tên
    const productRow = await $(`//a[contains(text(),"${productName}")]/ancestor::div[contains(@class,"row")]`);

    // Tìm button xóa trong productRow
    const removeButton = await productRow.$('button'); // Hoặc cụ thể hơn nếu có class "remove"

    // Scroll và click
    await removeButton.scrollIntoView();
    await removeButton.waitForClickable({ timeout: 5000 });
    await removeButton.click();
  }

  // Nếu muốn giữ remove theo index
  public async removeProduct(index: number = 0): Promise<void> {
    await this.removeBtns[index].scrollIntoView();
    await this.removeBtns[index].waitForClickable({ timeout: 5000 });
    await this.removeBtns[index].click();
  }

  public get cartIcon() {
    return $('//a[text()=" Cart"]');
  }

  public get btnCheckout() {
    return $('.btn-block.btn.btn-primary'); // dựa vào class
  }

  public async open(): Promise<void> {
    await browser.url('/cart');
  }

  // Phương thức nhấn nút Proceed To Checkout
  public async proceedToCheckout(): Promise<void> {
    await this.btnCheckout.waitForDisplayed({ timeout: 5000 });
    await this.btnCheckout.click();

    // Chờ URL chứa /shipping
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('/shipping'),
      {
        timeout: 10000,
        timeoutMsg: 'Shipping page did not load in time'
      }
    );

    // Chờ input address hiển thị luôn
    await ShippingPage.inputAddress.waitForDisplayed({ timeout: 30000 });
  }
}

export default new CartPage();