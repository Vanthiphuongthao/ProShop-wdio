export default class Page {
  /**
   * open a path (accepts '/path' or 'path')
   */
  open(path = '') {
    const p = path.startsWith('/') ? path : `/${path}`;
    return browser.url(p);
  }
}