import React, { Component } from 'react';
import FluxComponent from 'flummox/component';
import Map from './Map.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import Sidebar from './Sidebar.jsx';
import WeatherWidget from './WeatherWidget.jsx';


import Modal from 'react-modal';

const MOSCOW_COORDS = [55.752585, 37.627284];

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

        <FluxComponent connectToStores={['login', 'points']}>
          <Toolbar/>
        </FluxComponent>

        <FluxComponent connectToStores={{
          points: store => ({
            points: store.getFilteredPoints(),
            selected: store.getSelectedPoint(),
            showPlates: store.state.showPlates
          })
        }}>
          <Map center={MOSCOW_COORDS}
               zoom={10}
               showAttribution={false}
               renderLoop={this.props.renderLoop}
               showPlates={this.state.showPlates}/>

          <Sidebar/>

        </FluxComponent>
{/*
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          closeTimeoutMS={150}
        >
          <iframe style={{ width: '100%', height: '100%', border: 'none'}} src="http://ods.mos.ru/ssd/#/dashboard/file/default.json"/>
          </Modal>

        <button className="open-modal-button" onClick={this.openModal.bind(this)}><span className="glyphicon glyphicon-stats"></span></button>*/}
        <WeatherWidget/>
      </div>
    );
  }

}

export default MainPage;
