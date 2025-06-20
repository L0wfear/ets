import * as React from 'react';
import { Redirect } from 'react-router-dom';
import requireAuth from 'utils/auth';

import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { compose } from 'recompose';
import { MapEtsProvider } from 'components/new/ui/map/context/MapetsContext';
import LoadingProvider from 'components/new/utils/context/loading/LoadingProvider';
import EtsGlobalStyle from 'global-styled';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

/**
 * используется только в 1 месте для редиректа, если урл не разрешён или пользователь не залогинен
 */
const withCheckPrivateRouteMain = (Component) => {
  let wantedUrl = null;

  const Container: React.FC<any> = ({ hasValidToken, userData, ...props }) => {
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
        <LoadingProvider>
          <EtsGlobalStyle />
          <Component />
        </LoadingProvider>
      </MapEtsProvider>
    );
  };

  return compose(
    withSearch,
    connect<any, any, any, ReduxState>(
      (state) => ({
        hasValidToken: Boolean(getSessionState(state).token),
        userData: getSessionState(state).userData,
      }),
    ),
  )(Container);
};

export default withCheckPrivateRouteMain;
