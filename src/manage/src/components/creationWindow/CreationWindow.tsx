import * as React from 'react'
import './creationWindow.scss'
import { Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap'
import io from 'socket.io-client'

export interface CreationWindowState {
    processingRequest: boolean
    socketState: {
        connected: boolean,
        lastMessage: string
    },
    screenshotName: string,
    url: string,
    selector: string,
    languageChoices: {
        en: boolean,
        fr: boolean,
        de: boolean,
        es: boolean,
        ja: boolean,
        pt: boolean,
    }
}
export default class CreationWindow extends React.Component<{}, CreationWindowState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            processingRequest: false,
            socketState: {
                connected: false,
                lastMessage: ''
            },
            screenshotName: '',
            url: '',
            selector: '',
            languageChoices: {
                en: false,
                fr: false,
                de: false,
                es: false,
                ja: false,
                pt: false,
            }
        }
    }
    checkValues = () => {
        return this.state.url && this.state.screenshotName && this.state.selector
    }

    socketConnect = () => {
        this.setState({ processingRequest: true })
        const host = `http://${window.location.hostname}:3001`
        const socket = io(host)

        socket.on('connect', () => {
            this.setState({socketState: { connected: true, lastMessage: ''}})
            this.sendRequest(socket)
            socket.on('progress', (s: string) => {
                this.setState({socketState: {connected:true, lastMessage: s}})
            })
        })
    }

    sendRequest = (socket: SocketIOClient.Socket) => {
        console.log('emit event')
        // @ts-ignore
        const languages = Object.keys(this.state.languageChoices).filter(lang => this.state.languageChoices[lang])
        socket.emit('createNew', {
            name: this.state.screenshotName,
            baseUrl: this.state.url,
            selector: this.state.selector,
            languages
        }, (reply: any) => {
            this.setState({socketState: {connected: true, lastMessage: reply}})
        })
    }

    renderNameTooltip = (props: any) => (
        <Tooltip id="name-tooltip" {...props}>
            This can be anything you like, try to give it a descriptive name so others can find it in future!
        </Tooltip>
    )

    renderURLTooltip = (props: any) => (
        <Tooltip id="url-tooltip" {...props}>
            For this field, simply copy and paste the URL of the page you want to capture from your web browser!
        </Tooltip>
    )

    renderSelectorTooltip = (props: any) => (
        <Tooltip id="selector-tooltip" {...props}>
            A selector can be any valid HTML selector, however it needs to be unique. For help getting one install the SelectorGadget add-in and use it to click the element you want to capture!
        </Tooltip>
    )

    renderLanguageTooltip = (props: any) => (
        <Tooltip id="language-tooltip" {...props}>
            The languages you want this screenshot to be available in
        </Tooltip>
    )

    setLangSelected = (lang: 'all' | 'en' | 'de' | 'ja' | 'fr' | 'es' | 'pt', selected: boolean) => {
        if(lang === 'all') {
            this.setState({languageChoices: {
                en: selected,
                fr: selected,
                de: selected,
                es: selected,
                ja: selected,
                pt: selected,
            }})

            return
        }
        const langs = this.state.languageChoices
        langs[lang] = selected
        this.setState({languageChoices: langs})
    }

    renderLanguageSelector = () => {
        const state = this.state
        return (
            <div className='language-container'>
                <div className='language-selector'>
                    <p>🌐</p>
                    <input type='checkbox' checked={state.languageChoices.en && 
                                                    state.languageChoices.fr && 
                                                    state.languageChoices.de && 
                                                    state.languageChoices.es && 
                                                    state.languageChoices.ja && 
                                                    state.languageChoices.pt} 
                            onChange={(e) => this.setLangSelected('all', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇬🇧</p>
                    <input type='checkbox' checked={state.languageChoices.en} onChange={(e) => this.setLangSelected('en', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇫🇷</p>
                    <input type='checkbox' checked={state.languageChoices.fr} onChange={(e) => this.setLangSelected('fr', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇩🇪</p>
                    <input type='checkbox' checked={state.languageChoices.de} onChange={(e) => this.setLangSelected('de', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇯🇵</p>
                    <input type='checkbox' checked={state.languageChoices.ja} onChange={(e) => this.setLangSelected('ja', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇵🇹</p>
                    <input type='checkbox' checked={state.languageChoices.pt} onChange={(e) => this.setLangSelected('pt', e.target.checked)}/>
                </div>
                <div className='language-selector'>
                    <p>🇪🇸</p>
                    <input type='checkbox' checked={state.languageChoices.es} onChange={(e) => this.setLangSelected('es', e.target.checked)}/>
                </div>
            </div>
        )
    }

    render = () => {
        return (
            <div className='creation-container'>
            {
                !this.state.processingRequest ? (
                    <>
                    <h3 className='creation-header'>Create a new snap</h3>
                    <form className='creation-form'>
                        <div className='creation-input'>
                            <p>Screenshot name 
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={this.renderNameTooltip}
                            >
                                <sup className='help'> ?</sup>
                            </OverlayTrigger></p>
                            <input type='text' onChange={(e) => {this.setState({ screenshotName: e.target.value})}}></input>
                        </div>


                        <div className='creation-input'>
                            <p>URL <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={this.renderURLTooltip}
                            >
                                <sup className='help'> ?</sup>
                            </OverlayTrigger></p>
                            
                            <input type='text' onChange={(e) => {this.setState({url: e.target.value})}}></input>
                        </div>
                        <div className='creation-input'>
                            <p>
                                Selector
                                <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={this.renderSelectorTooltip}
                            >
                                <sup className='help'> ?</sup>
                            </OverlayTrigger>
                            </p>
                            
                            <input type='text' onChange={(e) => {this.setState({selector: e.target.value})}}></input>
                        </div>
                        <div className='creation-input'>
                            <p>
                                Languages
                                <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={this.renderLanguageTooltip}
                            >
                                <sup className='help'> ?</sup>
                            </OverlayTrigger>
                            </p>
                            { this.renderLanguageSelector() }
                        </div>
                        <Button disabled={!this.checkValues()} className='creation-submit' onClick={ () => this.socketConnect() }>Punch it</Button>
                    </form>
                    </>
                )
                : (
                <div className='creation-connection-container'>
                    <h3 className='creation-header'>Creating your new snaps!</h3>
                    <Spinner animation="border" />
                    <p className='creation-status'>{this.state.socketState.lastMessage}</p>
                </div>
                )
            }
            </div>
        )
    }
}