import React from 'react';
import './App.scss';
import CaptureInfo from './components/captureInfo/CaptureInfo';
import Gallery from './components/gallery/Gallery';
import CreationWindow from './components/creationWindow/CreationWindow';
import { Button, Carousel } from 'react-bootstrap';
import shuffle from 'shuffle-array'

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

  renderCreationPrompt = () => {
    if(!this.state.fileIndex.captures) { return }
    let images = Object.keys(this.state.fileIndex.captures).map(k => this.state.fileIndex.captures[k]).flat()
    shuffle(images)
    return (
      <>
      <div className='header-text'>
        <h3>Create the perfect screenshots</h3>
          <h1>Up to date, localized, device specific</h1>
          <p>With magic snaps, you can take control of the screenshots in your article content. They will always be up to date, relevant to the customer and beautiful!</p>
            <Button className='app-show-creator-btn' variant='primary' onClick={() => this.setState({showCreator: true})}>Get Snapping</Button>
        </div>
        <Carousel controls={ false } indicators={ false } interval={1500}>
          {images.map((src:string) => (
            <Carousel.Item>
            <img
              className="d-block w-100"
              src={src}
              alt='a capture'
            />
            </Carousel.Item>
          ))}
          
        </Carousel>
      </>
    )
  }

  renderCreationHelp = () => { 
    return (
      <>
      <div className='header-text'>
        <h3>Let's get snapping</h3>
          <h1>Create a forever screenshot in three easy steps</h1>
          <p>Navigate to the page you want to snap, and use the Chrome extension to select it, copy the URL and selectors into the form below, and give your snap a memorable name!</p>
      </div>
        <img className='demo-gif' src='demo.gif'/>
      </>
    )
  }


  renderManageHelp = () => { 
    return (
      <>
      <div className='header-text'>
        <h3>Manage your images</h3>
          <h1>Review and update your snaps</h1>
          <p>If your images update, we will let you know, and give you the chance to review them and push them to their destination</p>
      </div>
        <img src='friend.png'/>
      </>
    )
  }

  renderHeader = () => { 
    
    return (
      <div className='header'>
        {this.state.showCreator && this.renderCreationHelp()} 
        { this.state.selectedTab && this.renderManageHelp() }
        {!this.state.showCreator && !this.state.selectedTab && this.renderCreationPrompt()}
        
      </div>
    )
  }
 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className='app-title'>
            <div className='logo' onClick={() => this.setState({ showCreator: false, selectedTab: undefined })}>
              <img className='dbx-img' src="https://cfl.dropboxstatic.com/static/images/logo_catalog/glyph_m1.svg"/>
              <img className='dbx-txt' src="https://cfl.dropboxstatic.com/static/images/logo_catalog/wordmark--dropbox_m1.svg"/>
            </div>
            <div className='snaps-logo'>
              <h1 className='snaps-title'>Magic Snaps! 📸</h1>
            </div>
          </div>
          { this.renderHeader() }
          { this.getComponent() }
        </header>
      </div>
    )
  }
}

export default App;
