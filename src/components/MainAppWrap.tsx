import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import requireAuth from 'utils/auth';

import MainApp from 'components/MainApp';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { MapEtsProvider } from './new/ui/map/context/MapetsContext';

class MainAppWrap extends React.Component <any, any> {
  static get contextTypes() {
    return {
      flux: PropTypes.object.isRequired,
    };
  }

  render() {
    const {
      hasValidToken,
      userData,
      ...props
    } = this.props;

    const {
      match: { url },
    } = props;

    const permittedPath = requireAuth(userData.permissionsSet, url);

    if (!hasValidToken) { // нет токена
      return (
        <Redirect to="/login" />
      );
    } else if (url !== permittedPath) { // запрашиваемый урл не разрешён
      return (
        <Redirect to={permittedPath} />
      );
    }
    if (url === '/change-company' && !userData.isGlavControl) { // для главконтроля
      return (
        <Redirect to={requireAuth(userData.permissionsSet, '/monitor')} />
      );
    }

    return (
      <MapEtsProvider>
        <MainApp {...props} />
      </MapEtsProvider>
    );
  }
}

export default compose(
  withRouter,
  connect<any, any, any, any, ReduxState>(
    (state) => ({
      hasValidToken: Boolean(getSessionState(state).token),
      userData: getSessionState(state).userData,
    }),
    null,
    null,
  ),
)(MainAppWrap);
