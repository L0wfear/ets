import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import Map from './map/Map.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from './WeatherWidget.jsx';
//import Modal from 'react-modal';


//@TODO убрать хардкод и показывать/убирать по пропсам
class Preloader extends Component {

  render() {
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


          <Map zoom={3}
               center={[-399.43090337943863, -8521.192605428025]}/>

          <Sidebar/>

        </FluxComponent>
         <WeatherWidget/>
      </div>
    );
  }

}

export default MainPage;
