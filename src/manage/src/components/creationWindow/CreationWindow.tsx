import * as React from 'react'
import './creationWindow.scss'
import { Button, Spinner } from 'react-bootstrap'
import io from 'socket.io-client'

export interface CreationWindowState {
    processingRequest: boolean
    socketState: {
        connected: boolean,
        lastMessage: string
    },
    screenshotName: string,
    url: string,
    selector: string
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
            selector: ''
        }
    }
    checkValues = () => {
        return this.state.url && this.state.screenshotName && this.state.selector
    }

    socketConnect = () => {
        this.setState({ processingRequest: true })
        const socket = io('http://localhost:3001')

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
        socket.emit('createNew', {
            name: this.state.screenshotName,
            baseUrl: this.state.url,
            selector: this.state.selector
        }, (reply: any) => {
            this.setState({socketState: {connected: true, lastMessage: reply}})
        })
    }

    render = () => {
        return (
            <div className='creation-container'>
            {
                !this.state.processingRequest ? (
                    <>
                    <h3 className='creation-header'>Create a new snap</h3>
                    <form className='creation-form'>
                        <div><span>Screenshot name</span><input type='text' onChange={(e) => {this.setState({ screenshotName: e.target.value})}}></input></div>
                        <div><span>URL</span><input type='text' onChange={(e) => {this.setState({url: e.target.value})}}></input></div>
                        <div><span>Selector</span><input type='text' onChange={(e) => {this.setState({selector: e.target.value})}}></input></div>

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