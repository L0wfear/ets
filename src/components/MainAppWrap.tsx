import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import requireAuth from 'utils/auth';

import MainApp from 'components/MainApp';

class MainAppWrap extends React.Component <any, any> {
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

    const {
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

    return <MainApp {...this.props} />;
  }
}

export default (props) => <MainAppWrap {...props} />;
