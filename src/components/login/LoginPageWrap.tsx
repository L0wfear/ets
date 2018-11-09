import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import requireAuth from 'utils/auth';
import LoadingComponent from 'components/ui/PreloaderMainPage';

const ReactTest: any = React;

const LoginPage = ReactTest.lazy(() => (
  import(/* webpackChunkName: "login_page" */'components/login/LoginPage')
));

class LoginPageWrap extends React.Component<any, any> {
  context!: ETSCore.LegacyContext;

  static get contextTypes() {
    return {
      flux: PropTypes.object.isRequired,
    };
  }

  render() {
    const {
      flux,
    } = this.context;

    if (flux.getStore('session').isLoggedIn()) {
      const user = flux.getStore('session').getCurrentUser();

      return <Redirect to={requireAuth(flux, `/${user.default_path}`)} />;
    } else {
      return (
        <ReactTest.Suspense fallback={<LoadingComponent />}>
          <LoginPage
            {...this.props}
            login={flux.getActions('session').login}
            loadData={this.props.loadData}
          />;
        </ReactTest.Suspense>
      )
    }
  }
}

export default (props) => <LoginPageWrap {...props} />;
