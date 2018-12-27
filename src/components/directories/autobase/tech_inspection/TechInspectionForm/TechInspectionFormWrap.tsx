import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsTechInspectionFormWrap } from 'components/directories/autobase/tech_inspection/TechInspectionForm/@types/TechInspectionForm.h';

const TechInspectionFrom = React.lazy(() => (
  import(/* webpackChunkName: "tech_inspection_form" */ 'components/directories/autobase/tech_inspection/TechInspectionForm/TechInspectionForm')
));

class TechInspectionFormWrap extends React.Component<PropsTechInspectionFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <TechInspectionFrom
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

export default TechInspectionFormWrap;
