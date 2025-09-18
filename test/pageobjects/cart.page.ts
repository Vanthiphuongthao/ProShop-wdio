import { $$, $, browser } from "@wdio/globals";
import Page from "./page";
// import ShippingPage from './shipping.page';
import { ShippingPage } from "./shipping.page";

export class CartPage extends Page {
  public get cartProducts() {
    return $$('//div[@class="row"]//a');
  }
  public get cartItems() {
    return $$(".list-group-item");
  }
  public get removeBtns() {
    return $$("button.remove");
  }
  public get cartIcon() {
    return $('//a[text()=" Cart"]');
  }
  public get btnCheckout() {
    return $(".btn-block.btn.btn-primary");
  }

  public getProduct(productName: string) {
    return $(`//a[contains(., "${productName}")]`);
  }
  public getProductQuantity(productName: string) {
    return $(
      `//a[contains(., "${productName}")]/ancestor::div[@class="row"]//select`
    );
  }

  public async updateQuantity(productName: string, qty: number): Promise<void> {
    const quantitySelect = await this.getProductQuantity(productName);
    await quantitySelect.waitForDisplayed({ timeout: 5000 });
    if (qty <= 0) qty = 1;
    const option = await quantitySelect.$(`option[value="${qty}"]`);
    if (!(await option.isExisting())) return;
    await quantitySelect.selectByAttribute("value", String(qty));
  }

  public async removeProductByName(productName: string): Promise<void> {
    const productRow = await $(
      `//a[contains(text(),"${productName}")]/ancestor::div[contains(@class,"row")]`
    );
    const removeButton = await productRow.$("button");
    await removeButton.scrollIntoView();
    await removeButton.waitForClickable({ timeout: 5000 });
    await removeButton.click();
  }

  public async removeProduct(index: number = 0): Promise<void> {
    await this.removeBtns[index].scrollIntoView();
    await this.removeBtns[index].waitForClickable({ timeout: 5000 });
    await this.removeBtns[index].click();
  }

  public async open(): Promise<void> {
    await super.open("/cart");
  }

  public async proceedToCheckout(): Promise<void> {
    await this.btnCheckout.click();
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes("/shipping"),
      { timeout: 10000 }
    );

    //tạo instance trước khi gọi
    const shipping = new ShippingPage();
    await shipping.inputAddress.waitForDisplayed({ timeout: 30000 });
  }
}
