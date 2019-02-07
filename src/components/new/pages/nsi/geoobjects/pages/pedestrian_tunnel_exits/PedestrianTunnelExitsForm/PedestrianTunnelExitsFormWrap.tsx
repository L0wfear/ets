import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryResetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { PropsPedestrianTunnelExitsFormWrap } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/@types/PedestrianTunnelExitsForm.h';

const PedestrianTunnelExitsFrom = React.lazy(() => (
  import(/* webpackChunkName: "PedestrianTunnelExits_form" */ 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/PedestrianTunnelExitsForm')
));

class PedestrianTunnelExitsFormWrap extends React.Component<PropsPedestrianTunnelExitsFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}PedestrianTunnelExits-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <PedestrianTunnelExitsFrom
              element={element}
              handleHide={props.onFormHide}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default connect<any, any, any, ReduxState>(
  (state, { registryKey }) => ({
    element: getListData(state.registry, registryKey).data.selectedRowToShow,
  }),
  (dispatch, { registryKey }) => ({
    onFormHide: (...arg) => (
      dispatch(
        registryResetSelectedRowToShowInForm(
          registryKey,
          ...arg,
        ),
      )
    ),
  }),
)
(PedestrianTunnelExitsFormWrap);
