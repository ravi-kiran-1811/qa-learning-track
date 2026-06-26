/**
 * Checkout Page Object Model
 * Checkout page (/checkout). This is a demo store — any well-formed card
 * is accepted and no real payment is processed.
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Account section
  readonly emailInput = 'shop-checkout input[name="accountEmail"]';
  readonly phone = 'shop-checkout input[name="accountPhone"]';

  // Shipping section
  readonly firstName = 'shop-checkout input[name="shipAddress"]';   // address line used as first field
  readonly address = 'shop-checkout input[name="shipAddress"]';
  readonly city = 'shop-checkout input[name="shipCity"]';
  readonly state = 'shop-checkout input[name="shipState"]';
  readonly zipCode = 'shop-checkout input[name="shipZip"]';
  readonly country = 'shop-checkout select[name="shipCountry"]';

  // Payment section
  readonly cardName = 'shop-checkout input[name="ccName"]';
  readonly cardNumber = 'shop-checkout input[name="ccNumber"]';
  readonly expiryMonth = 'shop-checkout select[name="ccExpMonth"]';
  readonly expiryYear = 'shop-checkout select[name="ccExpYear"]';
  readonly cvv = 'shop-checkout input[name="ccCVV"]';

  readonly placeOrderBtn = 'shop-checkout >> text=Place Order';
  readonly cancelBtn = 'shop-checkout >> text=Cancel';
  readonly orderConfirmation = 'shop-checkout >> text=Thank you';

  constructor(page: Page) {
    super(page);
  }

  /** Fill all shipping and account fields from the provided data object. */
  async fillCustomerInfo(customerData: {
    email?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    city?: string;
    zip_code?: string;
    phone?: string;
    country?: string;
  }): Promise<void> {
    try {
      console.log('📋 Filling customer information…');
      if (customerData.email)
        await this.fillText(this.emailInput, customerData.email);
      if (customerData.phone)
        await this.fillText(this.phone, customerData.phone);
      if (customerData.address)
        await this.fillText(this.address, customerData.address);
      if (customerData.city)
        await this.fillText(this.city, customerData.city);
      if (customerData.zip_code)
        await this.fillText(this.zipCode, customerData.zip_code);
      console.log('✓ Customer information filled');
    } catch (error) {
      await this.handleError(`Failed to fill customer info: ${error}`);
    }
  }

  /** Fill the payment card fields. */
  async fillPaymentInfo(paymentData: {
    card_number?: string;
    expiry_date?: string;
    cvv?: string;
  }): Promise<void> {
    try {
      console.log('💳 Filling payment information…');
      if (paymentData.card_number)
        await this.fillText(this.cardNumber, paymentData.card_number);
      if (paymentData.cvv)
        await this.fillText(this.cvv, paymentData.cvv);
      console.log('✓ Payment information filled');
    } catch (error) {
      await this.handleError(`Failed to fill payment info: ${error}`);
    }
  }

  /** Click the Place Order button. */
  async placeOrder(): Promise<void> {
    try {
      console.log('✅ Placing order…');
      await this.page.locator('shop-checkout').getByText('Place Order').click();
      await this.page.waitForLoadState('networkidle');
      console.log('✓ Order placed');
    } catch (error) {
      await this.handleError(`Failed to place order: ${error}`);
    }
  }

  /** Return any visible error message text, or empty string. */
  async getErrorMessage(): Promise<string> {
    try {
      const msg = 'shop-checkout .error, [role="alert"]';
      if (await this.isVisible(msg)) return await this.getText(msg);
      return '';
    } catch {
      return '';
    }
  }

  /** Return true when the order confirmation ("Thank you") is visible. */
  async verifyOrderConfirmation(): Promise<boolean> {
    try {
      const visible = await this.isVisible(this.orderConfirmation);
      console.log(`✓ Order confirmation visible: ${visible}`);
      return visible;
    } catch (error) {
      await this.handleError(`Failed to verify order confirmation: ${error}`);
      return false;
    }
  }

  /** Click the Cancel button to leave checkout. */
  async cancelCheckout(): Promise<void> {
    try {
      console.log('❌ Cancelling checkout…');
      await this.click(this.cancelBtn);
      await this.page.waitForLoadState('networkidle');
      console.log('✓ Checkout cancelled');
    } catch (error) {
      await this.handleError(`Failed to cancel checkout: ${error}`);
    }
  }
}
