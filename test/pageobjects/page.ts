import { browser } from '@wdio/globals'
/**
 * Base Page Object
 */
export default class Page {
    /**
     * Opens a sub page (e.g. /register)
     * Will automatically prepend baseUrl if configured in wdio.conf.js
     */
    public open(path: string) {
        return browser.url(path);
    }
}