import * as React from 'react';
import * as PropTypes from 'prop-types';

import { HashRouter, Switch, Route } from 'react-router-dom';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';

import { MapEtsProvider } from 'components/map/context/MapetsContext';

import LoadingPage from 'components/LoadingPage';

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.APP_TIME_FORMAT = 'HH:mm';
global.APP_TIME_WITH_SECOND_FORMAT = 'HH:mm:ss';
global.SESSION_KEY2 = `${location.host}${location.pathname}-ets-session-${process.env.STAND}2`;
global.API__KEY2 = `${location.host}${location.pathname}-ets-api-version-${process.env.STAND}2`;

global.CURRENT_USER2 = `${location.host}${location.pathname}-current-user-${process.env.STAND}2`;

import LoginPageWrap from 'components/login/LoginPageWrap';
import MainAppWrap from 'components/MainAppWrap';

class App extends React.Component <any, any> {

  static get childContextTypes() {
    return {
      flux: PropTypes.object,
      loadData: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  getChildContext() {
    return {
      flux: this.props.flux,
      loadData: this.loadData.bind(this),
    };
  }

  componentDidMount() {
    this.loadData();
    const el = document.getElementById('main-background');
    if (el) {
      document.body.removeChild(el);
    }
  }

  loadData = () => {
    const { flux } = this.props;
    this.setState({ loading: true });
    if (!flux.getStore('session').isLoggedIn()) {
      return this.setState({ loading: false });
    }
    return AuthCheckService.get()
          .then(() => flux.getActions('objects').getConfig())
          .then(() => this.setState({ loading: false }))
          .catch((ErrorData) => {
            const { error_text, errorIsShow } = ErrorData;
            const t_error = error_text || ErrorData;

            /* tslint:disable:no-console */
            console.log(t_error);
            /* tslint:enable */
            if (t_error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM.notify(loginErrorNotification);
            }
            return !errorIsShow && global.NOTIFICATION_SYSTEM.notify(getErrorNotification(t_error));
          });
  }

  render() {
    switch (this.state.loading) {
      case true: return  <LoadingPage loaded={this.state.loading} />;
      case false:
        return (
          <MapEtsProvider>
            <HashRouter>
              <Switch>
                <Route path="/login" render={(props) => (
                  <LoginPageWrap {...props} loadData={this.loadData} />
                )} />
                <Route path="*" component={MainAppWrap} />
              </Switch>
            </HashRouter>
          </MapEtsProvider>
        );
    }
  }
}

export default App;
