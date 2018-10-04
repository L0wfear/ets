import * as React from 'react';
import * as PropTypes from 'prop-types';

import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import requireAuth from 'utils/auth';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';

import LoginPage from 'components/login/LoginPage';
import MainAppTSX from 'components/MainApp';

import { MapEtsProvider } from 'components/map/context/MapetsContext';

import LoadingPage from 'components/LoadingPage';

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.APP_TIME_FORMAT = 'HH:mm';
global.APP_TIME_WITH_SECOND_FORMAT = 'HH:mm:ss';
global.SESSION_KEY2 = `${location.host}${location.pathname}-ets-session-${process.env.STAND}2`;
global.CURRENT_USER2 = `${location.host}${location.pathname}-current-user-${process.env.STAND}2`;

import WithContext from 'components/compositions/vokinda-hoc/with-contetx/WithContext';
class Login extends React.Component<any, any> {
  render() {
    const {
      flux,
    } = this.props;

    if (flux.getStore('session').isLoggedIn()) {
      const user = flux.getStore('session').getCurrentUser();

      return <Redirect to={requireAuth(flux, `/${user.default_path}`)} />;
    } else {
      return <LoginPage {...this.props} />;
    }
  }
}

class Main extends React.Component <any, any> {
  render() {
    const {
      flux,
      match: { url },
    } = this.props;

    const permittedPath = requireAuth(flux, url);

    if (!flux.getStore('session').isLoggedIn()) {
      return <Redirect to="/login" />;
    } else if (url !== permittedPath) {
      return <Redirect to={permittedPath} />;
    }
    if (url === '/change-company' && !flux.getStore('session').state.isGlavControl) {
      return <Redirect to={requireAuth(flux, '/monitor')} />
    }

    return <MainAppTSX {...this.props} />;
  }
}


const LoginWrap = WithContext({
  flux: PropTypes.object,
})(Login)

const MainWrap = WithContext({
  flux: PropTypes.object,
})(Main)

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

  loadData() {
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
                <Route path="/login" component={LoginWrap} />
                <Route path="*" component={MainWrap} />
              </Switch>
            </HashRouter>
          </MapEtsProvider>
        );
    }
  }
}

export default App;
