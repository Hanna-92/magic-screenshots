import * as React from 'react'
import './gallery.scss'
import pathToName from '../../utils/pathToName'
export interface GalleryProps {
    captures: any
    tabSelected: (tab: string) => void
}

export default class Gallery extends React.Component<GalleryProps> {
    render = () => {
        const keys = this.props.captures ? Object.keys(this.props.captures) : []
        return (
            <div className='gallery-container'>
                <h3 className='gallery-header'>Your available snaps:</h3>
                <div className='gallery'>
                    {keys.map(k => (
                        <div className='gallery-tab' key={k} onClick={() => this.props.tabSelected(k)}>
                            <img src={this.props.captures[k][0]}></img>
                            <h3 className='gallery-name' > {pathToName(k)} </h3>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}