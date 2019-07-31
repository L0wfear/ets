import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { Redirect } from 'react-router-dom';

const LoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login_page" */ 'components/new/pages/login/LoginPage'),
);

class LoginPageWrap extends React.Component<any, any> {
  render() {
    if (this.props.hasValidToken) {
      return <Redirect to="/" />;
    }

    return (
      <React.Suspense fallback={<LoadingComponent />}>
        <LoginPage />;
      </React.Suspense>
    );
  }
}

export default connect<any, any, any, ReduxState>((state) => ({
  hasValidToken: Boolean(getSessionState(state).token),
}))(LoginPageWrap);
