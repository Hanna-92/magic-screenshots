import ImageCaptureSpec from "./spec"
import runSuite, { Suite } from "./suite"
import loginExtension from "./example_extension/loginExtension"
import languageUrlRewrite from "./example_extension/languageParamExtensions"

const homePageBarSpec: ImageCaptureSpec = {
    baseUrl: new URL("https://dropbox.com/h"),
    name: "Homepage Sidebar",
    selector: ".appactions-menu"
}

const businessCardSpec: ImageCaptureSpec = { 
    baseUrl: new URL("https://dropbox.com/business"),
    name: "Business Professional Card",
    selector: '.arbor-grid-element.arbor-plan-card.pro-biz-mve-plan-card__v2.arbor-align--flex-start.arbor-grid-element--width--1-1.arbor-direction--column.arbor-spacing--flex-start'
}

const activitySpec: ImageCaptureSpec = {
    baseUrl: new URL("https://dropbox.com/h"),
    name: "Based on your activity",
    selector: ".home-access-section.home-access-section-suggest-nonempty"
}

const navPanel: ImageCaptureSpec = {
    baseUrl: new URL("https://dropbox.com/h"),
    name: "Maestro nav panel",
    selector: ".maestro-nav__panel"
}


const suite: Suite = {
    captureList: [homePageBarSpec, businessCardSpec, activitySpec, navPanel],
    desiredLanguages: ['de', 'es']
}


runSuite(suite, { broswerHooks: {onBrowserReady: loginExtension}, captureHooks: {urlRewrite: languageUrlRewrite}}) 