import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsEmployeeFormLazy } from 'components/new/pages/nsi/employee/form/@types/EmployeeForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const EmployeeFrom = React.lazy(() => (
  import(/* webpackChunkName: "employee_form" */ 'components/new/pages/nsi/employee/form/EmployeeForm')
));

class EmployeeFormLazy extends React.Component<PropsEmployeeFormLazy, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}employee-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <EmployeeFrom
              element={element}
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

export default withFormRegistrySearch({})(EmployeeFormLazy);
