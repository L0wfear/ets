import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';
import { OwnPropsBatteryTab } from './index.h';

export const BatteryTabLazy = React.lazy(() => (
  import(/* webpackChunkName: "car_form_battery_tab" */ 'components/directories/autobase/cars/tabs/battery_tab')
));

export const BatteryTabLazyWrap: React.FunctionComponent<OwnPropsBatteryTab> = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <BatteryTabLazy {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
