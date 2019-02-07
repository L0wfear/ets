import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

const MissionInfoForm = React.lazy(() => (
  import(/* webpackChunkName: "mission_info_form" */ 'components/missions/mission/MissionInfoForm/MissionInfoForm')
));

class MissionInfoFormWrap extends React.Component<any, {}> {
  render() {
    const { showForm, ...props } = this.props;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <MissionInfoForm {...props} />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default MissionInfoFormWrap;
