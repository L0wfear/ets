import { Router, Route, RouteHandler, Link, Redirect } from 'react-router';
import { createHashHistory } from 'history';
import { render } from 'react-dom';
import React, { Component } from 'react';
// TODO сделать модуль containers по аналогии с другими модулями
import LoginPage from './login/LoginPage.jsx';
import WaybillJournal from './waybill/WaybillJournal.jsx';
import RoutesList from './route/RoutesList.jsx';
import MainPage from './MainPage.jsx';
import MonitorPage from './monitor/MonitorPage.jsx';
import LoadingPage from './LoadingPage.jsx';
import DashboardPage from './dashboard/DashboardPage.jsx';
import CompanyStructure from './company_structure/CompanyStructure.jsx';

import missions from './missions';
import directories from './directories';
import reports from './reports';
import { AuthCheckService } from 'api/Services';

import { fetchEvergisToken } from '../utils/evergis.js';
import Flux from 'config/flux.js';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';
// TODO вынести в отдельный файл
const flux = new Flux();
window.__ETS_CONTAINER__ = {
  flux,
};

class App extends Component {

  static get childContextTypes() {
    return {
      flux: React.PropTypes.object,
      loadData: React.PropTypes.func
    }
  }

  getChildContext() {
    return {
      flux,
      loadData: this.loadData.bind(this)
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: true
    };
  }

  loadData() {
    this.setState({loading: true});
    if (!flux.getStore('session').isLoggedIn()) {
      return this.setState({loading: false});
    }
    return AuthCheckService.get()
          .then(() => fetchEvergisToken())
          .then(() => {
            this.setState({loading: false});
          })
          .catch((error) => {
            console.log(error);
            if (error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM._addNotification(loginErrorNotification);
            }
            global.NOTIFICATION_SYSTEM._addNotification(getErrorNotification(error));
            console.error(error);
          })
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return !this.state.loading ? <MainPage location={this.props.location}>{this.props.children}</MainPage> : <LoadingPage loaded={this.state.loading}/>;
  }
}

function requireAuth(nextState, replaceState) {
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    console.warn('USER IS NOT LOGGED IN');
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
    return;
  }
}

function checkLoggedIn(nextState, replaceState) {
  const role = flux.getStore('session').getCurrentUser().role;
  if (flux.getStore('session').isLoggedIn() && role) {
    if (['dispatcher', 'master'].indexOf(role) > -1) {
      replaceState({}, '/dashboard');
    } else {
      replaceState({}, '/monitor');
    }
  }
}

const history = createHashHistory({queryKey: false});

const routes = (
  <Router history={history}>
    <Redirect from="/" to="monitor" />
    <Route path="/" component={App}>
      <Route path="monitor" component={MonitorPage} onEnter={requireAuth}/>
      {/* Отчет префекта */}
      <Route path="odh_coverage_report" component={reports.odhCoverageReport} onEnter={requireAuth}/>
      <Route path="dashboard" component={DashboardPage} onEnter={requireAuth}/>
      <Route path="waybill-journal" component={WaybillJournal} onEnter={requireAuth}/>
      <Route path="company-structure" component={CompanyStructure} onEnter={requireAuth}/>
      <Route path="routes-list" component={RoutesList} onEnter={requireAuth}/>
      {/* Задания */}
      <Route path="mission-journal" component={missions.missions} onEnter={requireAuth}/>
      <Route path="mission-templates-journal" component={missions.missionTemplates} onEnter={requireAuth}/>
      <Route path="duty-missions-journal" component={missions.dutyMissions} onEnter={requireAuth}/>
      <Route path="duty-mission-templates-journal" component={missions.dutyMissionTemplates} onEnter={requireAuth}/>
      {/* Отчеты */}
      <Route path="odh-reports" component={reports.odh} onEnter={requireAuth}/>
      <Route path="route-reports" component={reports.route.all} onEnter={requireAuth}/>
      <Route path="route-report/:id" component={reports.route.single} onEnter={requireAuth}/>
      <Route path="coverage-report" component={reports.coverage} onEnter={requireAuth}/>
      <Route path="fuel-consumption-report" component={reports.fuelConsumption} onEnter={requireAuth}/>
      <Route path="analytics" component={reports.analytics} onEnter={requireAuth}/>
      <Route path="car_func_type_usage_reports" component={reports.carFuncTypeUsage.all} onEnter={requireAuth}/>
      <Route path="daily-cleaning-reports-ets" component={reports.daily.cleaning.ets.all} onEnter={requireAuth}/>
      <Route path="daily-cleaning-report-ets/:element/:id" component={reports.daily.cleaning.ets.single} onEnter={requireAuth}/>
      <Route path="daily-cleaning-reports-cafap" component={reports.daily.cleaning.cafap.all} onEnter={requireAuth}/>
      <Route path="daily-cleaning-report-cafap/:element/:id" component={reports.daily.cleaning.cafap.single} onEnter={requireAuth}/>
      <Route path="weekly-technical-operation-complete-reports" component={reports.weekly.technicalOperationComplete.all} onEnter={requireAuth}/>
      <Route path="weekly-technical-operation-complete-report/:element/:id" component={reports.weekly.technicalOperationComplete.single} onEnter={requireAuth}/>
      {/* Отчеты - Задания */}
      <Route path="mission-reports" component={reports.mission.all} onEnter={requireAuth}/>
      <Route path="mission-report/:id" component={reports.mission.single} onEnter={requireAuth}/>
      <Route path="mission-report/:id/odhs/:index" component={reports.mission.singleByODH} onEnter={requireAuth}/>
      <Route path="mission-report/:id/dts/:index" component={reports.mission.singleByDT} onEnter={requireAuth}/>
      <Route path="mission-report/:id/points/:index" component={reports.mission.singleByPoints} onEnter={requireAuth}/>
      {/* НСИ - Реестры и справочники */}
      <Route path="employees" component={directories.employees} onEnter={requireAuth}/>
      <Route path="faxogramms" component={directories.faxogramm} onEnter={requireAuth}/>
      <Route path="fuel-rates" component={directories.fuelRates} onEnter={requireAuth}/>
      <Route path="fuel-operations" component={directories.fuelOperations} onEnter={requireAuth}/>
      <Route path="organizations" component={directories.organizations} onEnter={requireAuth}/>
      <Route path="technical-operations" component={directories.technicalOperations} onEnter={requireAuth}/>
      <Route path="car-func-types" component={directories.carTypes} onEnter={requireAuth}/>
      <Route path="cars" component={directories.cars} onEnter={requireAuth}/>
      <Route path="odh-support-standards" component={directories.odhSupportStandards} onEnter={requireAuth}/>
      <Route path="odh-support-standards-data-summer" component={directories.odhSupportStandardsDataSummer} onEnter={requireAuth}/>
      {/* НСИ - Реестры и справочники - Геоинструментарий */}
      <Route path="odh" component={directories.geoobjects.odh} onEnter={requireAuth}/>
      <Route path="dt" component={directories.geoobjects.dt} onEnter={requireAuth}/>
      <Route path="ssp" component={directories.geoobjects.ssp} onEnter={requireAuth}/>
      <Route path="msp" component={directories.geoobjects.msp} onEnter={requireAuth}/>
      <Route path="pgm" component={directories.geoobjects.pgm} onEnter={requireAuth}/>
      <Route path="snow-storage" component={directories.geoobjects.snowStorage} onEnter={requireAuth}/>
      <Route path="fueling-water" component={directories.geoobjects.fuelingWater} onEnter={requireAuth}/>
      <Route path="carpool" component={directories.geoobjects.carpool} onEnter={requireAuth}/>
      <Route path="danger-zones" component={directories.geoobjects.dangerZones} onEnter={requireAuth}/>
      {/* Страница логина */}
      <Route path="login" component={LoginPage} onEnter={checkLoggedIn}/>
    </Route>
  </Router>
);

render(routes, document.getElementById('content'));
