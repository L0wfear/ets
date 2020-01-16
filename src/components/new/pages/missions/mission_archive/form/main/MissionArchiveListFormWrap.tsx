import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import MissionInfoFormById from 'components/new/ui/mission_info_form/MissionInfoFormById';

const MissionForm = React.lazy(() =>
  import(/* webpackChunkName: "mission_form" */ 'components/new/pages/missions/mission/form/main/MissionForm'),
);

type MissionArchiveListFormWrapProps = {
  element: Partial<Mission>;
  type: string;

  readOnly: boolean;
  onFormHide: any;
  page: string;
  path: string;
};

const MissionArchiveListFormWrap: React.FC<MissionArchiveListFormWrapProps> = (props) => {
  const path = `${props.path ? `${props.path}-` : ''}-form`;

  if (props.element) {
    if (props.type === 'info') {
      return (
        <MissionInfoFormById
          element={props.element}
          handleHide={props.onFormHide}

          page="Mission"
          path={path}
        />
      );
    }

    if (props.type) {
      props.onFormHide(false);
    }

    return (
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
    );
  }

  return null;
};

export default withFormRegistrySearch({
  noCheckDataInRegistryArray: true,
  uniqKeyName: 'id',
  cantCreate: true,
})(MissionArchiveListFormWrap);
