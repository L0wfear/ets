import * as React from 'react';
import * as PropTypes from 'prop-types';

import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { withProps } from 'recompose';
import requireAuth from 'utils/auth.js';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';

import Login from 'components/login/LoginPage.jsx';
import MainAppTSX from 'components/MainApp.jsx';

import LoadingPage from './LoadingPage.jsx';

const MainApp: any = MainAppTSX;

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.APP_TIME_FORMAT = 'HH:mm';
global.SESSION_KEY2 = `ets-session-${process.env.STAND}2`;
global.CURRENT_USER2 = `current-user-${process.env.STAND}2`;
global.NOTIFICATION_READ_ARR = `notification-read-arr-${process.env.STAND}2`;

const getLoginPage = props => {
  const {
    flux,
  } = props;

  if (flux.getStore('session').isLoggedIn()) {
    const user = flux.getStore('session').getCurrentUser();

    return <Redirect to={requireAuth(flux, `/${user.default_path}`)} />;
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
  if (url === '/change-company' && !flux.getStore('session').state.isGlavControl) {
    return <Redirect to={requireAuth(flux, '/monitor')} />
  }

  return <MainApp {...props} />;
};

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

    document.body.removeChild(document.getElementById('main-background'));
  }

  loadData() {
    const { flux } = this.props;
    this.setState({ loading: true });
    if (!flux.getStore('session').isLoggedIn()) {
      return this.setState({ loading: false });
    }
    return AuthCheckService.get()
          .then(flux.getActions('objects').getConfig())
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
