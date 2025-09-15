// File: C:\Users\admin\ProShop-wdio\pageobjects\placeorder.page.js

class PlaceOrderPage {
    get btnPlaceOrder() {
        // Tìm button "Place Order"
        return $('button=Place Order'); 
    }

    async placeOrder() {
        // Chờ button Place Order hiển thị rồi click
        await this.btnPlaceOrder.waitForDisplayed({ timeout: 5000 });
        await this.btnPlaceOrder.click();
    }
    get paypalButton() {
    return $('div[id*="paypal"], div[class*="paypal"]');
}

}

module.exports = new PlaceOrderPage();