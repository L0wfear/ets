import { Router, Route, RouteHandler, Link, Redirect } from 'react-router';
import { createHashHistory } from 'history';
import { render } from 'react-dom';
import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import WaybillJournal from './WaybillJournal.jsx';
import WaybillForm from './WaybillForm.jsx';
import RoutesList from './RoutesList.jsx';
import MainPage from './MainPage.jsx';
import MonitorPage from './MonitorPage.jsx';
import LoadingPage from './LoadingPage.jsx';
import EmployeesList from './EmployeesList.jsx';
import CarsList from './CarsList.jsx';
import Modal from './ui/Modal.jsx';
import { init } from '../adapter.js';
import Flux from './Flux.js';

//const router = Router.create({ routes });
const flux = new Flux();

class App extends Component {

  getChildContext() {
    return {
      flux: flux,
      //router: router,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      error: false
    }
  }

  componentDidMount() {
    init()
      .then(() => this.setState({
          loading: false
        }))
      .catch((error) => {
    //debugger;
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
    return !this.state.loading ? <MainPage location={this.props.location}>{this.props.children}</MainPage> : <LoadingPage loaded={this.state.loading}/>;
  }
}

App.childContextTypes = {
  flux: React.PropTypes.object,
  //router: React.PropTypes.func,
};

let history = createHashHistory({queryKey: false});

const routes = (
  <Router history={history}>
    <Redirect from="/" to="monitor" />
    <Route path="/" component={App}>
      <Route path="monitor" component={MonitorPage}/>
      <Route path="waybill-journal" component={WaybillJournal}/>
      <Route path="waybill-journal/create" component={WaybillForm}/>
      <Route path="routes-list" component={RoutesList}/>
      <Route path="employees" component={EmployeesList}/>
      <Route path="cars" component={CarsList}/>
      {/*  <Route path="/user/:userId" component={User}/>*/}
      {/*<Route path="*" component={NoMatch}/>*/}
    </Route>
  </Router>
);

render(routes, document.getElementById('content'))
