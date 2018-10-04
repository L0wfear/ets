import React, { Component, PropTypes } from 'react';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';
import MainPage from './MainPage.jsx';
import LoadingPage from './LoadingPage.jsx';

const { location } = window;

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.APP_TIME_FORMAT = 'HH:mm';
global.APP_TIME_WITH_SECOND_FORMAT = 'HH:mm:ss';

global.SESSION_KEY = `${location.host}${location.pathname}-ets-session-${process.env.STAND}`;
global.CURRENT_USER = `${location.host}${location.pathname}-current-user-${process.env.STAND}`;

class App extends Component {

  static get propTypes() {
    return {
      location: PropTypes.object,
      children: PropTypes.node,
      flux: PropTypes.shape({}),
    };
  }

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
    document.body.removeChild(document.getElementById('main-background'));

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
          .catch((ErrorData) => {

            const { error, error_text, errorIsShow } = ErrorData;
            const t_error = error_text || ErrorData;

            if (t_error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM.notify(loginErrorNotification);
            }
            return !errorIsShow && global.NOTIFICATION_SYSTEM.notify(getErrorNotification(t_error));
          });
  }

  render() {
    return !this.state.loading
      ? <MainPage location={this.props.location} history={this.props.history}>{this.props.children}</MainPage>
      : <LoadingPage loaded={this.state.loading} />;
  }
}

export default App;
