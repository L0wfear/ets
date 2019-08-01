import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRoadAccidentFormLazy } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/@types/RoadAccident';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { memoizeMergeElement } from '../../../../utils';

const RoadAccidentFrom = React.lazy(() =>
  import(/* webpackChunkName: "road_accident_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/RoadAccidentForm'),
);

const RoadAccidentFormLazy: React.FC<PropsRoadAccidentFormLazy> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}road_accident-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <RoadAccidentFrom
          element={memoizeMergeElement(props.element, props.selectedCarData)}
          handleHide={props.onFormHide}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch<Pick<PropsRoadAccidentFormLazy, 'selectedCarData' >>({})(RoadAccidentFormLazy);
