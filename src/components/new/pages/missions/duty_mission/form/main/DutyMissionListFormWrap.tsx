import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

const DutyMissionForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_form" */ 'components/new/pages/missions/duty_mission/form/main/DutyMissionForm'),
);

type DutyMissionListFormWrapProps = {
  element: Partial<DutyMission>;

  readOnly: boolean;
  onFormHide: any;
  page: string;
  path: string;
};

const DutyMissionListFormWrap: React.FC<DutyMissionListFormWrapProps> = (props) => {
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
})(DutyMissionListFormWrap);
