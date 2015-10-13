import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import MainPage from './MainPage.jsx';
import LoadingPage from './LoadingPage.jsx';
import { init } from '../adapter.js';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      error: false
    }
  }

  componentDidMount() {
    init()
      .then(() => this.setState({
          loaded: true
        }))
      .catch((error) => {
        console.log('load error')
        this.setState({
          error: true
        })
        global.NOTIFICATION_SYSTEM._addNotification(
          {
            title: 'Упс, что-то пошло не так',
            message: 'Ошибка инициализации приложения: не удалось загрузить справочники (' + error + ')',
            level: 'error',
            dismissible: false,
            position: 'tc',
            autoDismiss: 0,
            action: {
              label: 'Перезагрузить',
              callback: function() {
                window.location.reload()
              }
            }
          }
        )
      })
  }

  render() {
    const flux = this.props.flux;
    const currentUser = flux.getStore('login').state.currentUser;

    if (this.state.error) {
      return <MainPage errorLoading={this.state.error}/>
    }

    if (this.state.loaded) {
      return currentUser ? <MainPage/> : <LoginPage/>;
    } else {
      return <LoadingPage loaded={this.state.loaded}/>
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
      <App flux={this.props.flux}/>
      );
  }

}

AppWrapper.childContextTypes = {
  flux: React.PropTypes.object
};

export default AppWrapper;
