import React, { Component, PropTypes } from 'react';

import { AuthCheckService } from 'api/Services';
import { loginErrorNotification, getErrorNotification } from 'utils/notifications';
import MainPage from './MainPage.jsx';
import LoadingPage from './LoadingPage.jsx';

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.SESSION_KEY = `ets-session-${process.env.STAND}`;
global.CURRENT_USER = `current-user-${process.env.STAND}`;

global.ERROR_GPS = `error-gps${global.SESSION_KEY}`;
global.ERROR_ASUODS = `error-ruslan${global.SESSION_KEY}`;

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
          .catch((error) => {
            console.log(error); // eslint-disable-line
            if (error === 401) {
              flux.getActions('session').logout();
              return global.NOTIFICATION_SYSTEM.notify(loginErrorNotification);
            }
            return global.NOTIFICATION_SYSTEM.notify(getErrorNotification(error));
          });
  }

  render() {
    return !this.state.loading
      ? <MainPage location={this.props.location}>{this.props.children}</MainPage>
      : <LoadingPage loaded={this.state.loading} />;
  }
}

export default App;
