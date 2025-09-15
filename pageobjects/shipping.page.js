class ShippingPage {
    // Shipping inputs
    get inputAddress() { return $('#address'); }
    get inputCity() { return $('#city'); }
    get inputPostalCode() { return $('#postalCode'); }
    get inputCountry() { return $('#country'); }


    // Buttons
    get btnContinue() { return $('.btn.btn-primary'); }
    get btnPlaceOrder() { return $('button=Place Order'); }

    // Error messages
    get errorMessages() { return $('.error'); }

    // Methods
    async fillShipping(address, city, postalCode, country) {
    await this.inputAddress.waitForDisplayed({ timeout: 30000 });
    await this.inputAddress.setValue(address);

    await this.inputCity.waitForDisplayed({ timeout: 5000 });
    await this.inputCity.setValue(city);

    await this.inputPostalCode.waitForDisplayed({ timeout: 5000 });
    await this.inputPostalCode.setValue(postalCode);

    await this.inputCountry.waitForDisplayed({ timeout: 5000 });
    await this.inputCountry.setValue(country);

    }
    
    async continue() { await this.btnContinue.click(); }
    async placeOrder() { await this.btnPlaceOrder.click(); }
    
    async selectPayment(method = 'PayPal') {
        if (method === 'PayPal') await this.paymentPayPal.click();
        else await this.paymentCreditCard.click();
    }

    
}

// Export instance để spec dùng trực tiếp
module.exports = new ShippingPage();
