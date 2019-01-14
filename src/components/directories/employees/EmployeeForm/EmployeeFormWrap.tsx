import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import { PropsEmployeeFormWrap } from 'components/directories/employees/EmployeeForm/@types/EmployeeForm.h';

const EmployeeFrom = React.lazy(() => (
  import(/* webpackChunkName: "employee_form" */ 'components/directories/employees/EmployeeForm/EmployeeForm')
));

class EmployeeFormWrap extends React.Component<PropsEmployeeFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}employee-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <EmployeeFrom
            element={props.element}
            handleHide={props.onFormHide}

            page={page}
            path={path}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  }
}

export default EmployeeFormWrap;
