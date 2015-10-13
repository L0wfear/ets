import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import OpenlayersPage from './MainPage.jsx';
import { init } from '../adapter.js';
import Preloader from './ui/Preloader.jsx';


class LoadingPage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <Preloader visible={this.props.loaded}/>
  }
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    init()
    .then(()=>this.setState({loaded: true }))
    .catch((error)=>{
      console.log( 'load error')
      global.NOTIFICATION_SYSTEM._addNotification(
        {
          title: 'Упс',
          message: 'Ошибка инициализации приложения: не удалось загрузить справочники',
          level: 'error',
          dismissible: false,
          position: 'tc',
          autoDismiss: 0,
          action: {
            label: 'Попробовать перезагрузить',
            callback: function() {
              window.location.reload()
            }
          }
        }
      )})
  }

  render() {
    const flux = this.props.flux;
    const currentUser = flux.getStore('login').state.currentUser;

    if (this.state.loaded) {
      return currentUser ? <OpenlayersPage/> : <LoginPage/>;
    } else {
      return <LoadingPage loaded={this.state.loaded}/>
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
      <App flux={this.props.flux}/>
    );
  }

}

AppWrapper.childContextTypes = { flux: React.PropTypes.object };

export default AppWrapper;
