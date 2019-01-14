import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import { PropsRepairCompanyFormWrap } from 'components/directories/autobase/repair_company/RepairCompanyForm/@types/RepairCompany.h';

const RepairCompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "repair_company_form" */'components/directories/autobase/repair_company/RepairCompanyForm/RepairCompanyForm')
));

class RepairCompanyFormWrap extends React.Component<PropsRepairCompanyFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}repair-company-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <RepairCompanyFrom
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

export default RepairCompanyFormWrap;
