import { Browser } from "puppeteer";

const changeLanguageExtension = async (browser: Browser, lang: string ) => {
    const page = await browser.newPage();
    await page.goto('https://www.dropbox.com/account', { waitUntil:"networkidle2"});

    await page.$('#general-panel > div > div:nth-child(3) > div.account-page-module.account-key-value-block.locale-selector-block > div.account-key-value-block__links > button > span');
    
    await page.click('#general-panel > div > div:nth-child(3) > div.account-page-module.account-key-value-block.locale-selector-block > div.account-key-value-block__links > button > span')

    await page.$("#locale-selector-modal > div.db-modal > div > div > div");

    var lang_dict = {"en":9, "en_GB":8, "da_DK":5, "de":7, "es":11, 
    "es_ES":10, "fr":12, "id":3, "it":14, "ja":27}

    await page.click(`#locale-selector-modal > div.db-modal > div > div > div > div > ul > li:nth-child(${lang_dict[lang]}) > button > span`)

    await page.waitForNavigation()
}

export default changeLanguageExtension