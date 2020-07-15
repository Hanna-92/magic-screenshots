import ImageCaptureSpec from "./spec"
import runSuite, { Suite } from "./suite"
import loginExtension from "./example_extension/loginExtension"
import languageUrlRewrite from "./example_extension/languageParamExtensions"

const homePageBarSpec: ImageCaptureSpec = {
    baseUrl: new URL("https://dropbox.com/h"),
    name: "Homepage Sidebar",
    selector: ".appactions-menu"
}

const suite: Suite = {
    captureList: [homePageBarSpec],
    desiredLanguages: ['en']
}


runSuite(suite, { broswerHooks: {onBrowserReady: loginExtension}, captureHooks: {urlRewrite: languageUrlRewrite}}) 