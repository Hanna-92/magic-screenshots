import { Browser } from "puppeteer";
import { get as getConfig } from 'config'

const loginExtension = async (browser: Browser) => {
    const page = await browser.newPage();
    await page.goto("https://www.dropbox.com/login", { waitUntil:"networkidle0"});

    const username = getConfig('username') as string
    const password = getConfig('password') as string

    await page.type('input[name*="login_email"]', username);
    
    await page.type('input[name*="login_password"]', password);

    await page.click('.login-button')

    await page.waitForNavigation()
}

export default loginExtension