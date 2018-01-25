import * as React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { withProps } from 'recompose';
import requireAuth from 'utils/auth.js';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';

import Login from 'components/login/LoginPage.jsx';
import MainApp from 'components/MainApp.jsx';

import LoadingPage from './LoadingPage.jsx';

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.SESSION_KEY = `ets-session-${process.env.STAND}`;
global.CURRENT_USER = `current-user-${process.env.STAND}`;

const getLoginPage = props => {
  const {
    flux,
  } = props;

  if (flux.getStore('session').isLoggedIn()) {
    const user = flux.getStore('session').getCurrentUser();
    const { role, okrug_id } = user;

    if (['dispatcher', 'master'].indexOf(role) > -1 && okrug_id === null) {
      return <Redirect to={requireAuth(flux, '/dashboard')} />;
    } else {
      return <Redirect to={requireAuth(flux, '/monitor')} />;
    }
  } else {
    return <Login {...props} />;
  }
};

const getMainApp = props => {
  const {
    flux,
    match: { url },
  } = props;
  const permittedPath = requireAuth(flux, url);

  if (!flux.getStore('session').isLoggedIn()) {
    return <Redirect to="/login" />;
  } else if (url !== permittedPath) {
    return <Redirect to={permittedPath} />;
  }

  return <MainApp {...props} />;
};

class App extends React.Component <any, any> {

  static get childContextTypes() {
    return {
      flux: React.PropTypes.object,
      loadData: React.PropTypes.func,
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
  }

  loadData() {
    const { flux } = this.props;
    this.setState({ loading: true });
    if (!flux.getStore('session').isLoggedIn()) {
      return this.setState({ loading: false });
    }
    return AuthCheckService.get()
          .then(() => flux.getActions('objects').getConfig())
          .then(() => {
            this.setState({ loading: false });
          })
          .catch(error => {
            /* tslint:disable:no-console */
            console.log(error);
            /* tslint:enable */
            if (error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM.notify(loginErrorNotification);
            }
            return global.NOTIFICATION_SYSTEM.notify(getErrorNotification(error));
          });
  }

  render() {
    switch (this.state.loading) {
      case true: return  <LoadingPage loaded={this.state.loading} />;
      case false:
        const {
          flux,
        } = this.props;

        const LoginPage = withProps({ flux })(getLoginPage);
        const MainPage = withProps({ flux })(getMainApp);
        return (
          <HashRouter>
            <Switch>
              <Route path="/login" render={LoginPage} />
              <Route path="*" render={MainPage} />
            </Switch>
          </HashRouter>
        );
    }
  }
}

export default App;
