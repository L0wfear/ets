import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';
import { PropsRouteFormWrap } from 'components/route_new/form/RouteForm.h';

const RouteForm = React.lazy(() => (
  import(/* webpackChunkName: "route_form" */ 'components/route_new/form/RouteForm')
));

class RouteFormWrap extends React.Component<PropsRouteFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <RouteForm
            page={props.page}
            handleHide={props.handleHide}
            element={props.element}
            routesMapNameId={props.routesMapNameId}
            fromMission={props.fromMission}
            fromOrder={props.fromOrder}
            missionAvailableRouteTypes={props.missionAvailableRouteTypes}
            hasMissionStructureId={props.hasMissionStructureId}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  }
}

export default RouteFormWrap;
