import * as puppeteer from 'puppeteer'

export default interface BrowserHooks {
    onBrowserReady?(browser: puppeteer.Browser): void
}
