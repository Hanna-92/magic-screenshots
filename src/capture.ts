import * as puppeteer from 'puppeteer'
import ImageCaptureSpec from './spec';

let b: puppeteer.Browser

const capture = async (browser: puppeteer.Browser, captureSpec: ImageCaptureSpec, lang: string) => {
    const { selector, baseUrl, name } = captureSpec

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': lang
    });

    await page.goto(baseUrl.toString(), { waitUntil:"networkidle2"});
    const target = await page.$(selector);
    target.tap()
    const clip = await target.boundingBox();
    
    const fileName = name.replace(' ', '_').toLowerCase()
    await page.screenshot({path: `captures/${fileName}_${lang}.png`, clip });
}

export default capture