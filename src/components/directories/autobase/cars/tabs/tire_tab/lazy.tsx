import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryRegistry from 'components/error_boundary_registry/ErrorBoundaryRegistry';
import { OwnPropsTireTab } from './index.h';

export const TireTabLazy = React.lazy(() => (
  import(/* webpackChunkName: "car_form_tire_tab" */ 'components/directories/autobase/cars/tabs/tire_tab')
));

export const TireTabLazyWrap: React.FunctionComponent<OwnPropsTireTab> = (props) => (
  <ErrorBoundaryRegistry>
    <React.Suspense fallback={<LoadingComponent />}>
      <TireTabLazy {...props}/>
    </React.Suspense>
  </ErrorBoundaryRegistry>
);
