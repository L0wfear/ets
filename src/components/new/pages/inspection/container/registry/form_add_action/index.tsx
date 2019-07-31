import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { InspectContainer } from 'redux-main/reducers/modules/inspect/container/@types/container';

type InspectContainerFormAddActionLazyProps = {
  showForm: boolean;
  addAction: (obj: ValuesOf<InspectContainer['actions']>) => void;
  hideWithoutChanges: () => void;
};

const InspectContainerFormAddAction = React.lazy(() => (
  import(/* webpackChunkName: "inspect_container_form_add_action" */ 'components/new/pages/inspection/container/registry/form_add_action/InspectContainerFormAddAction')
));

const InspectContainerFormAddActionLazy: React.FC<InspectContainerFormAddActionLazyProps> = (props) => {
  return props.showForm ?
    (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <InspectContainerFormAddAction
            addAction={props.addAction}
            hideWithoutChanges={props.hideWithoutChanges}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    )
    :
    (
      <DivNone />
    );
};

export default InspectContainerFormAddActionLazy;
