import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import OpenLayersMap from './openlayers/map.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from './WeatherWidget.jsx';
import Modal from 'react-modal';


//@TODO убрать хардкод и показывать/убирать по пропсам
class Preloader extends Component {

  render(){
    return (
      <div className="cssload-loader"></div>
    )
  }
}


class MainPage extends Component {

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalIsOpen: false,
      showPlates: false
    };
  }

  render() {
    return (
      <div>

        <Preloader/>

        <FluxComponent connectToStores={['login', 'points']}>
          <Toolbar/>
        </FluxComponent>


        <FluxComponent connectToStores={{
          points: store => ({
            points: store.state.points,
            selected: store.getSelectedPoint(),
            showPlates: store.state.showPlates
          })
        }}>

          <Sidebar/>

          <OpenLayersMap/>


        </FluxComponent> 
         <WeatherWidget/>
      </div>
    );
  }

}

export default MainPage;
