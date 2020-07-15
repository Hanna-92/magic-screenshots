import * as puppeteer from 'puppeteer'
import {readFileSync, renameSync, writeFileSync} from 'fs'
import { PNG } from 'pngjs'

const pixelmatch = require('pixelmatch')

import ImageCaptureSpec from './spec';
import createFolderIfNotExists from './util/createFolderIfNotExists';
import { Options } from './suite';

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
    const savePath = `${specDir}/${fileName}_${lang}`

    const oldImage = existingImage(`${savePath}.png`)
    const oldSavePath = savePath + '_old.png'
    if(oldImage) {
        try {
            renameSync(`${savePath}.png`, oldSavePath)
        } catch {}
    }
    await page.screenshot({path: `${savePath}.png`, clip });
    if(oldImage) {
        const diffPath = compareImages(oldImage, savePath)
        if(!diffPath) { return [`${savePath}.png`]}
        return [`${savePath}.png`, diffPath, oldSavePath ]
    }
    return [`${savePath}.png`]
}

const existingImage = (path: string) => {
    try {
        return readFileSync(path)
    } catch {
        return undefined
    }
}

const compareImages = (oldImage: Buffer, newImagePath: string) => {
     
    const img1 = PNG.sync.read(oldImage);
    const img2 = PNG.sync.read(readFileSync(`${newImagePath}.png`));
    const {width, height} = img1;
    const diff = new PNG({width, height});
     
    const mismatch = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.3});
    if(mismatch > 0) {
        const diffPath = newImagePath + '_diff.png'
        writeFileSync(diffPath, PNG.sync.write(diff));
        return diffPath
    }
    return undefined
}

export default capture