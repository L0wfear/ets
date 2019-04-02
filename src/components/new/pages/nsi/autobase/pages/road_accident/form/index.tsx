import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRoadAccidentFormLazy } from 'components/new/pages/nsi/autobase/pages/road_accident/form/@types/RoadAccident';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const RoadAccidentFrom = React.lazy(() =>
  import(/* webpackChunkName: "road_accident_form" */ 'components/new/pages/nsi/autobase/pages/road_accident/form/RoadAccidentForm'),
);

const RoadAccidentFormLazy: React.FC<PropsRoadAccidentFormLazy> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}road_accident-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <RoadAccidentFrom
          element={props.element}
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

export default withFormRegistrySearch({})(RoadAccidentFormLazy);
