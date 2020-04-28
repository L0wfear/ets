import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import { PropsRouteFormWrap } from 'components/new/pages/routes_list/form/RouteForm.h';

const RouteForm = React.lazy(() =>
  import(/* webpackChunkName: "route_form" */ 'components/new/pages/routes_list/form/RouteForm'),
);

const RouteFormWrap: React.FC<PropsRouteFormWrap> = React.memo(
  (props) => {
    return props.showForm && (
      <React.Suspense fallback={<LoadingComponent />}>
        <RouteForm
          page={props.page}
          handleHide={props.handleHide}
          element={props.element}
          routesMapNameId={props.routesMapNameId}
          fromMission={props.fromMission}
          fromMissionTemplate={props.fromMissionTemplate}
          fromOrder={props.fromOrder}
          missionAvailableRouteTypes={props.missionAvailableRouteTypes}
          hasMissionStructureId={props.hasMissionStructureId}
        />
      </React.Suspense>
    );
  }
);

export default RouteFormWrap;
