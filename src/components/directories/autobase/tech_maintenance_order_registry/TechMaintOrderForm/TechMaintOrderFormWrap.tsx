import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechMaintOrderFormWrap } from 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderForm/@types/TechMaintOrderForm.h';

const TechMaintOrderFrom = React.lazy(() => (
  import(/* webpackChunkName: "tech_maint_order_form" */ 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderForm/TechMaintOrderForm')
));

class TechMaintOrderFormWrap extends React.Component<PropsTechMaintOrderFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <TechMaintOrderFrom
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

export default TechMaintOrderFormWrap;
