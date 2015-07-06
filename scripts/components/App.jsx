import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import MainPage from './MainPage.jsx';
import FluxComponent from 'flummox/component';

class App extends Component {

  render() {
    const { currentUser, renderLoop } = this.props;

    if (!currentUser) {
      return (
        <LoginPage/>
      );
    } else {
      return (
        <MainPage renderLoop={renderLoop}/>
      );
    }
  }

}



class AppWrapper {

  getChildContext() {
    return {
      flux: this.props.flux
    }
  }


  render() {
    return (
      <FluxComponent connectToStores={['login']}>
        <App renderLoop={this.props.renderLoop}/>
      </FluxComponent>
    );
  }

}

AppWrapper.childContextTypes = { flux: React.PropTypes.object };


export default AppWrapper;

// <MainPage renderLoop={this.props.renderLoop}/>
