import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  loginErrorNotification,
  getErrorNotification,
} from 'utils/notifications';

global.NODE_ENV = process.env.NODE_ENV;
/* Глобальный формат даты для всех дейтпикеров и строк */
global.APP_DATE_FORMAT = 'DD.MM.YYYY';
global.APP_TIME_FORMAT = 'HH:mm';
global.APP_TIME_WITH_SECOND_FORMAT = 'HH:mm:ss';
global.SESSION_KEY2 = `${location.host}${location.pathname}-ets-session-${
  process.env.STAND
}2`;
global.SESSION_KEY_ETS_TEST_BY_DEV2 = `${location.host}${
  location.pathname
}-ets_test_by_dev-session-${process.env.STAND}2`;
global.API__KEY2 = `${location.host}${location.pathname}-ets-api-version-${
  process.env.STAND
}2`;

import LoginPageWrap from 'components/new/pages/login/LoginPageWrap';
import MainAppWrap from 'components/MainAppWrap';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import {
  checkToken,
  sessionResetData,
} from 'redux-main/reducers/modules/session/actions-session';
import { getSessionState } from 'redux-main/reducers/selectors';
import { Switch, Route } from 'react-router-dom';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import LoadingComponent from 'components/ui/PreloaderMainPage';

class App extends React.Component<any, any> {
  static get childContextTypes() {
    return {
      flux: PropTypes.object,
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
    };
  }

  componentDidMount() {
    this.checkToken();
  }

  componentDidUpdate(prevProps) {
    const localStorageToken = JSON.parse(
      window.localStorage.getItem(global.SESSION_KEY2),
    );

    if (
      prevProps.token !== this.props.token &&
      localStorageToken !== this.props.token
    ) {
      this.checkToken();
    }
  }

  checkToken = async () => {
    this.setState({ loading: true });

    try {
      await this.props.checkToken();
      this.setState({ loading: false });
    } catch (ErrorData) {
      const { error_text, errorIsShow } = ErrorData;
      const t_error = error_text || ErrorData;

      console.log(t_error); // tslint:disable-line:no-console

      if (t_error === 401) {
        this.props.sessionResetData();
        return global.NOTIFICATION_SYSTEM.notify(loginErrorNotification);
      }
      return (
        !errorIsShow &&
        global.NOTIFICATION_SYSTEM.notify(getErrorNotification(t_error))
      );
    }

    const el = document.getElementById('main-background');

    if (el) {
      document.body.removeChild(el);
    }
  };

  render() {
    const localStorageToken = JSON.parse(
      window.localStorage.getItem(global.SESSION_KEY2),
    );

    if (this.state.loading || localStorageToken !== this.props.token) {
      return <LoadingComponent />;
    }

    return (
      <Switch>
        <Route path="/login" component={LoginPageWrap} />
        <Route path="*" component={MainAppWrap} />
      </Switch>
    );
  }
}

export default compose<any, any>(
  withPreloader({
    page: 'main',
    typePreloader: 'mainpage',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
      token: getSessionState(state).token,
    }),
    (dispatch: any) => ({
      checkToken: () => dispatch(checkToken()),
      sessionResetData: () => dispatch(sessionResetData()),
    }),
  ),
)(App);
