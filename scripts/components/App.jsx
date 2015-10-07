import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import OpenlayersPage from './OpenLayers.jsx';
//import FluxComponent from 'flummox/component';
//import NotificationSystem from 'react-notification-system';

class App extends Component {

  constructor(props){
    super(props)
  }

  render() {
    const flux = this.props.flux;
    const currentUser = flux.getStore('login').state.currentUser;
    const renderLoop = this.props.renderLoop;

    if (!currentUser) {
      return (
        <LoginPage/>
      );
    } else {
      return (
        <OpenlayersPage renderLoop={renderLoop}/>
        )
    }
  }
}


class AppWrapper  {

  getChildContext() {
    return {
      flux: this.props.flux
    }
  }

  render() {
    return (
      <App renderLoop={this.props.renderLoop} flux={this.props.flux}/>
    );
  }

}

AppWrapper.childContextTypes = { flux: React.PropTypes.object };

export default AppWrapper;
