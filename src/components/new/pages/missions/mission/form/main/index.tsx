import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsMissionFormLazy } from './@types/index.h';

const MissionForm = React.lazy(() => (
  import(/* webpackChunkName: "mission_form" */ 'components/new/pages/missions/mission/form/main/MissionForm')
));

class MissionFormLazy extends React.Component<PropsMissionFormLazy, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}mission_form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <MissionForm
              element={props.element}
              handleHide={props.onFormHide}

              notChangeCar={props.notChangeCar}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default MissionFormLazy;
