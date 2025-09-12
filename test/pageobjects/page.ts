import { browser } from '@wdio/globals'

export default class Page {
    public async open(path: string): Promise<void> {
        await browser.url(path);
    }
}