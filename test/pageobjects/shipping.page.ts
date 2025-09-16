import { $, browser } from '@wdio/globals';

class ShippingPage {
    // Shipping inputs
    public get inputAddress() {
        return $('#address');
    }
    public get inputCity() {
        return $('#city');
    }
    public get inputPostalCode() {
        return $('#postalCode');
    }
    public get inputCountry() {
        return $('#country');
    }

    // Buttons
    public get btnContinue() {
        return $('.btn.btn-primary');
    }
    public get btnPlaceOrder() {
        return $('button=Place Order');
    }

    // Error messages
    public get errorMessages() {
        return $('.error');
    }

    // Methods
    public async fillShipping(address: string, city: string, postalCode: string, country: string): Promise<void> {
        await this.inputAddress.waitForDisplayed({ timeout: 30000 });
        await this.inputAddress.setValue(address);

        await this.inputCity.waitForDisplayed({ timeout: 5000 });
        await this.inputCity.setValue(city);

        await this.inputPostalCode.waitForDisplayed({ timeout: 5000 });
        await this.inputPostalCode.setValue(postalCode);

        await this.inputCountry.waitForDisplayed({ timeout: 5000 });
        await this.inputCountry.setValue(country);
    }
    
    public async continue(): Promise<void> {
        await this.btnContinue.click();
    }
    public async placeOrder(): Promise<void> {
        await this.btnPlaceOrder.click();
    }
    
    // There were no selectors for payment methods, so I commented this out
    // public async selectPayment(method: string = 'PayPal'): Promise<void> {
    //     if (method === 'PayPal') {
    //         await this.paymentPayPal.click();
    //     } else {
    //         await this.paymentCreditCard.click();
    //     }
    // }
}

// Export instance for direct use
export default new ShippingPage();