import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRepairFormWrap } from 'components/directories/autobase/repair/RepairForm/@types/Repair.h';

const RepareFrom = React.lazy(() => (
  import(/* webpackChunkName: "repare_form" */ 'components/directories/autobase/repair/RepairForm/RepairForm')
));

class RepareFormWrap extends React.Component<PropsRepairFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}repare-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <RepareFrom
              element={props.element}
              handleHide={props.onFormHide}
              car_id={props.car_id}

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

export default RepareFormWrap;
