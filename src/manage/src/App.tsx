import React from 'react';
import './App.css';
import CaptureInfo from './components/captureInfo/CaptureInfo';
import Gallery from './components/gallery/Gallery';
import CreationWindow from './components/creationWindow/CreationWindow';
import { Button } from 'react-bootstrap';

export interface AppState {
  fileIndex: any,
  selectedTab?: string,
  showCreator: boolean
}

export class App extends React.Component<{}, AppState> {
  constructor(props:any) {
    super(props)
    this.state = {
      fileIndex: {},
      selectedTab: undefined,
      showCreator: false
    }
  }
  componentDidMount() {
    fetch('captures/index.json').then(data => {
      data.json().then(json => {
        this.setState({
          fileIndex: json
        })
      })
    })
  }

  getComponent = () => {
    if(this.state.selectedTab) {
      return <CaptureInfo capture={this.state.fileIndex.captures[this.state.selectedTab]} name={this.state.selectedTab} onClose={() => this.setState({selectedTab: undefined})} />
    } else if(this.state.showCreator) {
      return <CreationWindow/>
    }
    return <Gallery captures={this.state.fileIndex.captures} tabSelected={(selectedTab) => this.setState({selectedTab})}/>
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Dropbox Magic Snaps 📸</h1>
          { !this.state.showCreator && !this.state.selectedTab ? 
          <Button className='app-show-creator-btn' variant='primary' onClick={() => this.setState({showCreator: true})}>New Snap</Button>
          : <> </> 
          }
          { this.getComponent() }
        </header>
      </div>
    )
  }
}

export default App;
