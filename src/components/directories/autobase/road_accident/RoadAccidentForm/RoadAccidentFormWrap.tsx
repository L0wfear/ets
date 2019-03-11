import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRoadAccidentFormWrap } from 'components/directories/autobase/road_accident/RoadAccidentForm/@types/RoadAccident.h';

const RoadAccidentFrom = React.lazy(() =>
  import(/* webpackChunkName: "road_accident_form" */ 'components/directories/autobase/road_accident/RoadAccidentForm/RoadAccidentForm'),
);

class RoadAccidentFormWrap extends React.Component<
  PropsRoadAccidentFormWrap,
  {}
> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <RoadAccidentFrom
            element={props.element}
            handleHide={props.onFormHide}
            car_id={props.car_id}
            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    ) : (
      <DivNone />
    );
  }
}

export default RoadAccidentFormWrap;
