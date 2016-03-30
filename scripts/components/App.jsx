import { Router, Route, RouteHandler, Link, Redirect } from 'react-router';
import { createHashHistory } from 'history';
import { render } from 'react-dom';
import React, { Component } from 'react';
import LoginPage from './LoginPage.jsx';
import WaybillJournal from './waybill/WaybillJournal.jsx';
import MissionsJournal from './missions/MissionsJournal.jsx';
import DutyMissionsJournal from './missions/DutyMissionsJournal.jsx';
import DutyMissionTemplatesJournal from './missions/DutyMissionTemplatesJournal.jsx';
import MissionTemplatesJournal from './missions/MissionTemplatesJournal.jsx';
import RoutesList from './route/RoutesList.jsx';
import MainPage from './MainPage.jsx';
import MonitorPage from './monitor/MonitorPage.jsx';
import LoadingPage from './LoadingPage.jsx';
import DashboardPage from './dashboard/DashboardPage.jsx';
import DriversList from './drivers/DriversList.jsx';
import CarsList from './cars/CarsList.jsx';
import FuelRatesDirectory from './directories/FuelRatesDirectory.jsx';
import ODHDirectory from './directories/ODHDirectory.jsx';
import TechOperationsDirectory from './directories/TechOperationsDirectory.jsx';
import ODHReports from './reports/ODHReports.jsx';
import MissionReports from './reports/MissionReports.jsx';
import MissionReport from './reports/MissionReport.jsx';
import MissionReportByODH from './reports/MissionReportByODH.jsx';
import MissionReportByDT from './reports/MissionReportByDT.jsx';
import MissionReportByPoints from './reports/MissionReportByPoints.jsx';
import RouteLaunchReports from './reports/RouteLaunchReports.jsx';
import DailyCleaningReports from './reports/DailyCleaningReports.jsx';
import WeeklyTechnicalOperationCompleteReports from './reports/WeeklyTechnicalOperationCompleteReports.jsx';
import FaxogrammDirectory from './directories/faxogramm/FaxogrammDirectory.jsx';
import RouteReports from './reports/RouteReports.jsx';
import CompanyStructure from './company_structure/CompanyStructure.jsx';
import Modal from './ui/Modal.jsx';
import { checkToken, init } from '../adapter.js';
import Flux from './Flux.js';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';

const adapter = {};
const flux = new Flux(adapter);
window.__ETS_CONTAINER__ = {
  flux,
};

class App extends Component {

  getChildContext() {
    return {
      flux: flux,
      loadData: this.loadData.bind(this),
      setLoading: this.setLoading.bind(this),
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      error: false
    };
  }

  setLoading(loading) {
    this.setState({loading});
  }

  loadData() {
    this.setState({loading: true});
    if(!flux.getStore('session').isLoggedIn()) return this.setState({loading: false});
    return checkToken()
          .then(() => init())
          .then(() => this.setState({loading: false}))
          .catch((error) => {
            if (error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM._addNotification(loginErrorNotification);
            }
            console.log(error);
            global.NOTIFICATION_SYSTEM._addNotification(getErrorNotification(error));
          })
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return !this.state.loading ? <MainPage location={this.props.location}>{this.props.children}</MainPage> : <LoadingPage loaded={this.state.loading}/>;
  }
}

App.childContextTypes = {
  flux: React.PropTypes.object,
  loadData: React.PropTypes.func,
  setLoading: React.PropTypes.func,
};

let history = createHashHistory({queryKey: false});

function requireAuth(nextState, replaceState) {
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    console.warn('USER IS NOT LOGGED IN');
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

function checkLoggedIn(nextState, replaceState) {
  if (flux.getStore('session').isLoggedIn() && flux.getStore('session').getCurrentUser().role) {
    replaceState({}, '/dashboard');
  }
}

function loadData(nextState, replaceState, callback) {
  callback();
}

const routes = (
  <Router history={history}>
    <Redirect from="/" to="dashboard" />
    <Route path="/" component={App} onEnter={loadData}>
      <Route path="monitor" component={MonitorPage} onEnter={requireAuth}/>
      <Route path="dashboard" component={DashboardPage} onEnter={requireAuth}/>
      <Route path="waybill-journal" component={WaybillJournal} onEnter={requireAuth}/>
      <Route path="mission-journal" component={MissionsJournal} onEnter={requireAuth}/>
      <Route path="company-structure" component={CompanyStructure} onEnter={requireAuth}/>
      <Route path="duty-missions-journal" component={DutyMissionsJournal} onEnter={requireAuth}/>
      <Route path="duty-mission-templates-journal" component={DutyMissionTemplatesJournal} onEnter={requireAuth}/>
      <Route path="mission-templates-journal" component={MissionTemplatesJournal} onEnter={requireAuth}/>
      <Route path="routes-list" component={RoutesList} onEnter={requireAuth}/>
      <Route path="odh-reports" component={ODHReports} onEnter={requireAuth}/>
      <Route path="route-reports" component={RouteLaunchReports} onEnter={requireAuth}/>
      <Route path="daily-cleaning-reports" component={DailyCleaningReports} onEnter={requireAuth}/>
      <Route path="weekly-technical-operation-complete-reports" component={WeeklyTechnicalOperationCompleteReports} onEnter={requireAuth}/>
      <Route path="route-report/:id" component={RouteReports} onEnter={requireAuth}/>
      <Route path="mission-reports" component={MissionReports} onEnter={requireAuth}/>
      <Route path="mission-report/:id" component={MissionReport} onEnter={requireAuth}/>
      <Route path="mission-report/:id/odhs/:index" component={MissionReportByODH} onEnter={requireAuth}/>
      <Route path="mission-report/:id/dts/:index" component={MissionReportByDT} onEnter={requireAuth}/>
      <Route path="mission-report/:id/points/:index" component={MissionReportByPoints} onEnter={requireAuth}/>
      <Route path="drivers" component={DriversList} onEnter={requireAuth}/>
      <Route path="faxogramms" component={FaxogrammDirectory} onEnter={requireAuth}/>
      <Route path="fuel-rates" component={FuelRatesDirectory} onEnter={requireAuth}/>
      <Route path="odh" component={ODHDirectory} onEnter={requireAuth}/>
      <Route path="technical-operations" component={TechOperationsDirectory} onEnter={requireAuth}/>
      <Route path="cars" component={CarsList} onEnter={requireAuth}/>
      <Route path="login" component={LoginPage} onEnter={checkLoggedIn}/>
    </Route>
  </Router>
);

render(routes, document.getElementById('content'));
