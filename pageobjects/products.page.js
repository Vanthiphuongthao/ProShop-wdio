class ProductsPage {
  get addToCartBtn() {
    return $('button.btn-primary'); 
  }

  get quantityDropdown() {
    return $('select.form-control'); // selector trên trang product detail
  }

  async setQuantity(qty) {
    await this.quantityDropdown.waitForDisplayed();
    await this.quantityDropdown.selectByVisibleText(qty);
  }

  async addToCart() {
    await this.addToCartBtn.waitForDisplayed({ timeout: 10000 });
    await this.addToCartBtn.waitForClickable({ timeout: 10000 });
    await this.addToCartBtn.click();
  }
}

module.exports = new ProductsPage();
