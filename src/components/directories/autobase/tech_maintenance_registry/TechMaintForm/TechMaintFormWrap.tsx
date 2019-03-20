import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechMaintFormWrap } from 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/@types/TechMaintForm.h';

const TechMaintFrom = React.lazy(() =>
  import(/* webpackChunkName: "tech_maint_form" */ 'components/directories/autobase/tech_maintenance_registry/TechMaintForm/TechMaintForm'),
);

class TechMaintFormWrap extends React.Component<PropsTechMaintFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return showForm ? (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <TechMaintFrom
            element={props.element}
            handleHide={props.onFormHide}
            car_id={props.car_id}
            car_model_id={props.car_model_id}
            deepLvl={this.props.deepLvl}
            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    ) : (
      <DivNone />
    );
  }
}

export default TechMaintFormWrap;
