import { $, browser } from "@wdio/globals";
import Page from "./page";

export class ProductsPage extends Page {
  public get addToCartBtn() {
    return $("button.btn-primary");
  }
  public get quantityDropdown() {
    return $("select.form-control");
  }

  public async openProduct(productId: string) {
    await super.open(`/product/${productId}`);
  }

  public async setQuantity(qty: string) {
    await this.quantityDropdown.waitForDisplayed();
    await this.quantityDropdown.selectByVisibleText(qty);
  }

  public async addToCart() {
    await this.addToCartBtn.waitForClickable({ timeout: 10000 });
    await this.addToCartBtn.click();
  }
}
