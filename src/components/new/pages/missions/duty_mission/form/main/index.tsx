import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsDutyMissionFormLazy } from './@types/index.h';

const DutyMissionForm = React.lazy(() =>
  import(/* webpackChunkName: "duty_mission_form" */ 'components/new/pages/missions/duty_mission/form/main/DutyMissionForm'),
);

class DutyMissionFormLazy extends React.Component<
  PropsDutyMissionFormLazy,
  {}
> {
  render() {
    const { showForm, ...props } = this.props;
    // const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}-form`;

    return showForm ? (
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
  }
}

export default DutyMissionFormLazy;
