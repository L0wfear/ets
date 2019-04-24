import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { PropsCompanyStructureFormWrap } from 'components/new/pages/nsi/company_structure/form/@types/CompanyStructureForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CompanyStructureForm = React.lazy(() => (
  import(/* webpackChunkName: "company_structure_form" */ 'components/new/pages/nsi/company_structure/form/CompanyStructureForm')
));

class CompanyStructureFormLazy extends React.Component<PropsCompanyStructureFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}company-structure-form`;

    return (
      props.element
        && (
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
    );
  }
}

export default withFormRegistrySearch({})(CompanyStructureFormLazy);
