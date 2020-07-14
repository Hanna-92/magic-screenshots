import * as puppeteer from 'puppeteer'
import ImageCaptureSpec from './spec';
import createFolderIfNotExists from './util/createFolderIfNotExists';
import { Options } from './suite';

let b: puppeteer.Browser

const capture = async (browser: puppeteer.Browser, captureSpec: ImageCaptureSpec, lang: string, options: Options) => {
    let { selector, baseUrl, name } = captureSpec

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Language': lang
    });

    if(options && options.captureHooks && options.captureHooks.urlRewrite) {
        baseUrl = options.captureHooks.urlRewrite(baseUrl, lang)
    }
    await page.goto(baseUrl.toString(), { waitUntil:"networkidle2"});
    const target = await page.$(selector);
    target.tap()
    const clip = await target.boundingBox();
    
    const fileName = name.replace(' ', '_').toLowerCase()
    const saveDir = './src/manage/public/captures'
    const specDir = `${saveDir}/${fileName}`
    createFolderIfNotExists(specDir)
    const savePath = `${specDir}/${fileName}_${lang}.png`
    await page.screenshot({path: savePath, clip });
    return savePath
}

export default capture