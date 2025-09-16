import { $, browser } from '@wdio/globals';

class ProductsPage {
  public get addToCartBtn() {
    return $('button.btn-primary');
  }

  public get quantityDropdown() {
    return $('select.form-control');
  }

  public async setQuantity(qty: string): Promise<void> {
    await this.quantityDropdown.waitForDisplayed();
    await this.quantityDropdown.selectByVisibleText(qty);
  }

  public async addToCart(): Promise<void> {
    await this.addToCartBtn.waitForDisplayed({ timeout: 10000 });
    await this.addToCartBtn.waitForClickable({ timeout: 10000 });
    await this.addToCartBtn.click();
  }
}

export default new ProductsPage();