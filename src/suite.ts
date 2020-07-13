
import capture from './capture'
import ImageCaptureSpec from './spec'
import progress from './progress'
import BrowserHooks from './extensions/browserHooks'
import * as puppeteer from 'puppeteer'
import { stat,  mkdir } from 'fs'

export type Suite = {
    captureList: ImageCaptureSpec[]
    desiredLanguages: string[]
}

export type Options = {
    broswerHooks?: BrowserHooks
}

const runSuite = async (suite: Suite, options?: Options) => {
    console.log("Capturing screenshots")
    const saveDir = './captures'
    stat(saveDir, (err) => {
        if(err) {
            mkdir(saveDir, () => {})
        }        
    })
    const { captureList, desiredLanguages } = suite
    const length = (captureList.length * desiredLanguages.length)  + 1
    const bar = progress()
    bar.start(length, 0, {
        task: "Warming up..."
    })

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            height: 1080,
            width: 1920
        }
    });

    if(options && options.broswerHooks && options.broswerHooks.onBrowserReady) {
        await options.broswerHooks.onBrowserReady(browser)
    }
    bar.increment(1)
    for await (const captureItem of captureList) {
        for await (const language of desiredLanguages) {
            bar.increment(0, {
                task: `Capturing ${captureItem.name} in `,
                lang: language
            })
            await capture(browser, captureItem, language)
            bar.increment(1)
        }
    }
    process.exit(0)
}

export default runSuite