const languageUrlRewrite = (baseUrl: URL, lang: string) => {
    baseUrl.searchParams.set('cl', lang)
    return baseUrl
}

export default languageUrlRewrite