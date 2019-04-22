import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

const MissionForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_form" */ 'components/new/pages/missions/mission/form/main/MissionForm'),
);

type MissionArchiveListFormWrapProps = {
  element: Partial<Mission>;

  readOnly: boolean;
  onFormHide: any;
  page: string;
  path: string;
};

const MissionArchiveListFormWrap: React.FC<MissionArchiveListFormWrapProps> = (props) => {
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <MissionForm
          element={props.element}
          handleHide={props.onFormHide}

          page="mission-form"
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch({
  noCheckDataInRegistryArray: true,
  uniqKeyName: 'id',
  cantCreate: true,
})(MissionArchiveListFormWrap);
