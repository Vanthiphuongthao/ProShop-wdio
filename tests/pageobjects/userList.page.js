class UserListPage {
  get table() {
    return $('div.table-responsive table');
  }

  get tableHeaders() {
    return $$('div.table-responsive thead th');
  }

  get tableRows() {
    return $$('div.table-responsive tbody tr');
  }

  get firstRow() {
    return $('div.table-responsive tbody tr:first-child');
  }

  async getAdminIcon(row) {
    return await row.$('td:nth-child(4) svg');
  }

  async getEmailLink(row) {
    return await row.$('td:nth-child(3) a');
  }

  async getNameCell(row) {
    return await row.$('td:nth-child(2)');
  }

  async getEditButton(row) {
    return await row.$('a.btn-light.btn-sm');
  }

  async getDeleteButton(row) {
    return await row.$('button.btn-danger');
  }

  async navigateTo() {
    await browser.url('/admin/userlist');
    await this.table.waitForDisplayed();
  }

  async clickEditFirstUser() {
    const btn = await this.getEditButton(this.firstRow);
    await btn.click();
  }

  async clickEditByIndex(index) {
    const rows = await this.tableRows;
    if (rows.length < index) {
      throw new Error(`Not enough rows. Found ${rows.length}, but need ${index}`);
    }
    const btn = await this.getEditButton(rows[index - 1]);
    await btn.click();
  }

  async getFirstUserName() {
    const cell = await this.getNameCell(this.firstRow);
    return await cell.getText();
  }

  async getFirstUserEmail() {
    const link = await this.getEmailLink(this.firstRow);
    return await link.getText();
  }
  
    async findRowByText(text) {
    const rows = await this.tableRows;
    for (const row of rows) {
      const rowText = (await row.getText()) || '';
      if (rowText.includes(text)) {
        return row;
      }
    }
    throw new Error(`Row with text "${text}" not found`);
  }

  async rowExistsByText(text) {
    const rows = await this.tableRows;
    for (const row of rows) {
      const rowText = (await row.getText()) || '';
      if (rowText.includes(text)) {
        return true;
      }
    }
    return false;
  }

  async waitForLoaded() {
    // Adjust to your app's loading indicator if available
    await browser.waitUntil(
      async () => (await this.tableRows).length > 0,
      { timeout: 5000, interval: 100, timeoutMsg: 'User table did not load' }
    );
  }
  
}

export default new UserListPage();