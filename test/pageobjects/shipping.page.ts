import { $, browser } from "@wdio/globals";
import Page from "./page";

export class ShippingPage extends Page {
  public get inputAddress() {
    return $("#address");
  }
  public get inputCity() {
    return $("#city");
  }
  public get inputPostalCode() {
    return $("#postalCode");
  }
  public get inputCountry() {
    return $("#country");
  }
  public get btnContinue() {
    return $(".btn.btn-primary");
  }
  public get errorMessages() {
    return $(".error");
  }
  public async open() {
    await super.open("/shipping");
  }

  public async fillShipping(
    address: string,
    city: string,
    postalCode: string,
    country: string
  ): Promise<void> {
    await this.inputAddress.setValue(address);
    await this.inputCity.setValue(city);
    await this.inputPostalCode.setValue(postalCode);
    await this.inputCountry.setValue(country);
    await this.clickContinue();
  }
  public async clickContinue() {
    await this.btnContinue.waitForDisplayed({ timeout: 10000 });
    await this.btnContinue.waitForClickable({ timeout: 10000 });
    await this.btnContinue.click();
  }
}
