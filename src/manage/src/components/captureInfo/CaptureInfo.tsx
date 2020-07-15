import * as React from 'react'
import { Modal, Button } from 'react-bootstrap'
import iso from 'iso-639-1'
import pathToName from '../../utils/pathToName'
import './captureInfo.scss'

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
}

export default class CaptureInfo extends React.Component<CaptureInfoProps, CaptureInfoState> {

    imgRef: React.RefObject<HTMLImageElement>
    constructor(props: CaptureInfoProps) {
        super(props)
        this.state ={ 
            showImage: false,
            imgResolution: {width:0, height:0},
            activeImage: 0
        }
        this.imgRef = React.createRef();
    }

    componentDidMount = () => {

        const img = this.imgRef.current
        if(img) {
            this.setState({imgResolution: {width:img.clientWidth, height:img.clientHeight}})
        }
    }
    calculateLanguages = () => {
        const langs = (this.props.capture as Array<string>).map(x => x.substring(x.lastIndexOf('_') + 1, x.lastIndexOf('.')))
        return oxford(langs.map(lang => iso.getName(lang)))
    }

    render = () => (
        <div className='capture-info-container'>
            <div className='capture-info-image'>
                <img ref={this.imgRef} src={this.props.capture[0]} onClick={() => this.setState({showImage:true})}></img>
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
            </div>

            <Modal centered show={this.state.showImage} onHide={() => this.setState({showImage: false})}>
                <img src={this.props.capture[this.state.activeImage]}/>
                <Modal.Footer>
                <Button disabled={this.state.activeImage <= 0} variant="primary" onClick={() => this.setState({activeImage: this.state.activeImage - 1})}>
                    &lt;-
                </Button> 
                <Button disabled={this.state.activeImage >= this.props.capture.length - 1} variant="primary" onClick={() => this.setState({activeImage: this.state.activeImage + 1})}>
                    -&gt;
                </Button> 
                </Modal.Footer>
            </Modal>
        </div>
    )
}