export default interface CaptureHooks {
    urlRewrite?: (baseUrl: URL, lang: string) => URL
    onCaptureState?: (captureName: string) => void
}
