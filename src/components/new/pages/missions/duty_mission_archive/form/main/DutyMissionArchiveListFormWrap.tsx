import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

const DutyMissionForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_form" */ 'components/new/pages/missions/duty_mission/form/main/DutyMissionForm'),
);

type DutyMissionArchiveListFormWrapProps = {
  element: Partial<DutyMission>;

  readOnly: boolean;
  onFormHide: any;
  page: string;
  path: string;
};

const DutyMissionArchiveListFormWrap: React.FC<DutyMissionArchiveListFormWrapProps> = (props) => {
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <DutyMissionForm
          element={props.element}
          handleHide={props.onFormHide}
          readOnly={props.readOnly}

          page="duty_mission-form"
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
})(DutyMissionArchiveListFormWrap);
