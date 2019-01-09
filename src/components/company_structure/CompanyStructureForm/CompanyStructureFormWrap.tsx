import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsCompanyStructureFormWrap } from 'components/company_structure/CompanyStructureForm/@types/CompanyStructureForm.h';

const CompanyStructureForm = React.lazy(() => (
  import(/* webpackChunkName: "company_structure_form" */ 'components/company_structure/CompanyStructureForm/CompanyStructureForm')
));

class BatteryBrandFormWrap extends React.Component<PropsCompanyStructureFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}company-structure-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <CompanyStructureForm
              element={props.element}
              handleHide={props.onFormHide}

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

export default BatteryBrandFormWrap;
