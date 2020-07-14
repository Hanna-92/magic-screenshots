
import capture from './capture'
import ImageCaptureSpec from './spec'
import progress from './progress'
import BrowserHooks from './extensions/browserHooks'
import * as puppeteer from 'puppeteer'
import createFolderIfNotExists from './util/createFolderIfNotExists'
import { writeFileSync, readFileSync } from 'fs'
import CaptureHooks from './extensions/captureHooks'
import { mergeAndConcat } from 'merge-anything'
export type Suite = {
    captureList: ImageCaptureSpec[]
    desiredLanguages: string[]
}

export type Options = {
    broswerHooks?: BrowserHooks
    captureHooks?: CaptureHooks
}

const runSuite = async (suite: Suite, options?: Options) => {
    console.log("Capturing screenshots")
    const saveDir = './src/manage/public/captures'
    createFolderIfNotExists(saveDir)
    const { captureList, desiredLanguages } = suite
    const length = (captureList.length * desiredLanguages.length)  + 1
    const bar = progress()
    const results = {
        startTime: new Date(),
        captures: {}
    }

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
        const jsName = captureItem.name.replace(' ', '_').toLowerCase()
        results.captures[jsName] = []
        for await (const language of desiredLanguages) {
            const task = `Capturing ${captureItem.name} in `
            bar.increment(0, {
                task,
                lang: language
            })
            if(options && options.captureHooks && options.captureHooks.onCaptureState) {
                options.captureHooks.onCaptureState(task + language)
            }
            let saved = await capture(browser, captureItem, language, options)
            saved = saved.substr(saved.indexOf('/captures/'))
            results.captures[jsName].push(saved)
            bar.increment(1)
        }
    }

    let existingObj: string
    try {
        existingObj = readFileSync(`${saveDir}/index.json`, 'utf8')
    } catch {}
    let final: string
    if(existingObj) {
        const existingJSON = JSON.parse(existingObj)
        const merged = mergeAndConcat(existingJSON, results)
        final = JSON.stringify(merged)
    } else {
        final = JSON.stringify(results)
    }
    writeFileSync(`${saveDir}/index.json`, final)
    process.exit(0)
}

export default runSuite