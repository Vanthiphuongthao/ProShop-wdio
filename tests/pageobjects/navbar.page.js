// tests/pageobjects/UserList.page.js
class UserListPage {
  get table() { return $('table'); }
  get headers() { return $$('table thead tr th'); }
  get rows() { return $$('table tbody tr'); }

  async open() {
    // use full path so it works even if wdio.conf has no baseUrl
    await browser.url((process.env.BASE_URL || 'http://localhost:3000') + '/admin/userlist');
    await this.table.waitForExist({ timeout: 5000 });
  }

  async getHeaderTexts() {
    const hs = await this.headers;
    return Promise.all(hs.map(h => h.getText()));
  }

  async getRowCount() {
    const r = await this.rows;
    return r.length;
  }

  async firstRowData() {
    const row = await $('table tbody tr:nth-child(1)');
    return {
      id: await row.$('td:nth-child(1)').getText(),
      name: await row.$('td:nth-child(2)').getText(),
      email: await row.$('td:nth-child(3) a').getText()
    };
  }

  async hasActionButtons(rowIndex = 1) {
    const row = await $(`table tbody tr:nth-child(${rowIndex})`);
    const edit = await row.$('button.btn-light');
    const del  = await row.$('button.btn-danger');
    return {
      editExists: await edit.isExisting(),
      editDisplayed: await edit.isDisplayed(),
      deleteExists: await del.isExisting(),
      deleteDisplayed: await del.isDisplayed()
    };
  }
}

export default new UserListPage();