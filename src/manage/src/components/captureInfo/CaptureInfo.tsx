import * as React from 'react'
import { Modal, Button } from 'react-bootstrap'
import iso from 'iso-639-1'
import pathToName from '../../utils/pathToName'
import './captureInfo.scss'
import io from 'socket.io-client'

//@ts-ignore
import oxford from 'oxford-join'

export interface CaptureInfoProps {
    name: string
    capture: any
    onClose: () => void
}

export interface CaptureInfoState {
    showImage: boolean
    imgResolution: {width: number, height: number}
    activeImage: number
    showDiffs: boolean
    updating: boolean
    updateMessage: string
    lastError: string
}

export default class CaptureInfo extends React.Component<CaptureInfoProps, CaptureInfoState> {

    imgRef: React.RefObject<HTMLImageElement>
    constructor(props: CaptureInfoProps) {
        super(props)
        this.state ={ 
            showImage: false,
            imgResolution: {width:0, height:0},
            activeImage: 0,
            showDiffs: false,
            updating: false,
            updateMessage: '',
            lastError: ''
        }
        this.imgRef = React.createRef();
    }

    componentDidMount = () => {
        const img = this.imgRef.current
        if(img) {
            this.setState({imgResolution: {width:img.clientWidth, height:img.clientHeight}})
        }
    }

    calculateLanguageCodes = () => {
        const filterDiffs = (this.props.capture.files as Array<string>).filter(item => item.indexOf('_old') === -1 && item.indexOf('_diff') === -1)
        return filterDiffs.map(x => x.substring(x.lastIndexOf('_') + 1, x.lastIndexOf('.')))
    }
    calculateLanguages = () => oxford(this.calculateLanguageCodes().map(lang => iso.getName(lang)))

    hasDiff = () => {
        if(!this.props.capture.files) { return false }
        return (this.props.capture.files as Array<string>).some(item =>item.indexOf('_diff') !== -1) 
    }

    renderModal = () => {
        const imagesToRender = (this.props.capture.files as Array<string>).filter(item => item.indexOf('_old') === -1 && item.indexOf('_diff') === -1)
        return (
            <Modal centered show={this.state.showImage} onHide={() => this.setState({showImage: false})}>
                <img src={imagesToRender[this.state.activeImage]}/>
                <Modal.Footer>
                <Button disabled={this.state.activeImage <= 0} variant="primary" onClick={() => this.setState({activeImage: this.state.activeImage - 1})}>
                    &lt;-
                </Button> 
                <Button disabled={this.state.activeImage >= imagesToRender.length - 1} variant="primary" onClick={() => this.setState({activeImage: this.state.activeImage + 1})}>
                    -&gt;
                </Button> 
                </Modal.Footer>
            </Modal>
        )
    }

    renderDiffs = () => {
        const diffs = (this.props.capture.files as Array<string>).filter(item => item.indexOf('_diff') !== -1).sort()
        const olds =  (this.props.capture.files as Array<string>).filter(item => item.indexOf('_old') !== -1).sort()
        const diff = diffs[0]
        const old = olds[0]

        if(!diff || !old) {
            return undefined
        }
        const newImg = old.replace('_old', '')
        
        return(
            <div>
                <div className='capture-diffs'>
                    <div className='diff'>
                        <img src={old}/>
                        <p className='diff-caption'>This is the original image</p>
                    </div>
                    <div className='diff'>
                        <img src={newImg}/>
                        <p className='diff-caption'>And here's the new one</p>
                    </div>
                    <div className='diff'>
                        <img src={diff}/>
                        <p className='diff-caption'>This is what we think changed!</p>
                    </div>
                </div>
                <div className='capture-diffs-buttons'>
                    <Button variant='secondary' onClick={() => alert("Sorry, this isn't implemented yet!!")}>Reject new image</Button>
                    <Button onClick={() => alert("Sorry, this isn't implemented yet!!")}>Accept new image</Button>
                </div>
            </div>
        )

    }

    regenScreenshots = () => {
        const host = `https://${window.location.hostname}:3001`
        const socket = io(host)
        this.setState({updating: true})
        socket.on('connect_error', (e: Error) => {
            this.setState({lastError: e.message})
        })
        socket.on('connect', () => {
            socket.on('progress', (s: string) => {
                this.setState({updateMessage: s})
            })
            socket.on('error', (e: string) => {
                this.setState({lastError: e.toString()})
            })
            socket.emit('createNew', {
                name: this.props.capture.name,
                baseUrl: this.props.capture.baseUrl,
                selector: this.props.capture.selector,
                languages: this.calculateLanguageCodes()
            }, (reply: any) => {
                this.setState({updateMessage: reply})
            })
        })
    }

    renderUpdateStatus = () => (
        <div>
            { this.state.lastError !== '' ? <p className='error-warning'>!</p> : <img src='cute.gif'/> }
            <p>{this.state.updateMessage}</p>
            <p className='creation-error'>{this.state.lastError}</p>
        </div>
    )
    render = () => (
        <div className='capture-info'>
            {this.hasDiff() && 
                <div className='capture-info-warning-panel'>
                    <p className='capture-info-warning'>This image has changed since it was last captured!</p>
                    { this.state.showDiffs ? this.renderDiffs() : <Button onClick={() => this.setState({showDiffs: true})}>Show me</Button> }
                </div> 
            }
            <div className='capture-info-container'>
                <div className='capture-info-image'>
                    <img ref={this.imgRef} src={this.props.capture.files[0]} onClick={() => this.setState({showImage:true})}></img>
                </div>
                <div>
                    <p>Here's whats available for <span className='capture-info-name'>{pathToName(this.props.name)}</span></p>
                <table className='capture-info-table'>
                    <tbody>
                    <tr>
                        <td className='left-col'>Languages</td>
                        <td> 
                            {
                                <p>{this.calculateLanguages()}</p>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td className='left-col'>Resolutions</td>
                        <td> 
                            {
                                <p>{this.state.imgResolution.width} * {this.state.imgResolution.height}</p>
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
                { !this.state.updating  ?
                    <Button onClick={() => {
                        this.regenScreenshots()
                    }}>Regenerate Screenshots</Button>
                    : this.renderUpdateStatus()
                }
                </div>
                {this.renderModal()}
            </div>
        </div>
    )
}