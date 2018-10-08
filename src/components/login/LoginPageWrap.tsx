import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import requireAuth from 'utils/auth';

import LoginPage from 'components/login/LoginPage';

class LoginPageWrap extends React.Component<any, any> {
  static get contextTypes() {
    return {
      flux: PropTypes.object.isRequired,
    };
  }

  render() {
    console.log(this.context)
    const {
      flux,
    } = this.context;

    if (flux.getStore('session').isLoggedIn()) {
      const user = flux.getStore('session').getCurrentUser();

      return <Redirect to={requireAuth(flux, `/${user.default_path}`)} />;
    } else {
      return <LoginPage {...this.props} />;
    }
  }
}

export default (props) => <LoginPageWrap {...props} />;
