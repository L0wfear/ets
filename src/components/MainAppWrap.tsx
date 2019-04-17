import * as React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import requireAuth from 'utils/auth';

import MainApp from 'components/MainApp';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { MapEtsProvider } from './new/ui/map/context/MapetsContext';
import EtsGlobalStyle from 'global-styled';

let wantedUrl = null;

const MainAppWrap: React.FC<any> = ({ hasValidToken, userData, ...props }) => {
  const {
    match: { url },
  } = props;

  if (!hasValidToken) {
    wantedUrl = url;
    // нет токена
    return <Redirect to="/login" />;
  }

  if (wantedUrl) {
    const temp = wantedUrl;
    wantedUrl = null;
    return <Redirect to={temp} />;
  }

  const permittedPath = requireAuth(userData.permissionsSet, url);

  if (url !== permittedPath) {
    // запрашиваемый урл не разрешён
    return <Redirect to={permittedPath} />;
  }
  if (url === '/change-company' && !userData.isGlavControl) {
    // для главконтроля
    return <Redirect to={requireAuth(userData.permissionsSet, '/monitor')} />;
  }

  return (
    <MapEtsProvider>
      <EtsGlobalStyle />
      <MainApp {...props} />
    </MapEtsProvider>
  );
};

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
