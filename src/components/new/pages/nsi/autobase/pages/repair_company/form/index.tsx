import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsRepairCompanyFormLazy } from 'components/new/pages/nsi/autobase/pages/repair_company/form/@types/RepairCompanyForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const RepairCompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "repair_company_form" */ 'components/new/pages/nsi/autobase/pages/repair_company/form/RepairCompanyForm')
));

const RepairCompanyFormWrap: React.FC<PropsRepairCompanyFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}repair_company-form`;

    return (
      props.element
        ? (
          <ErrorBoundaryForm>
            <React.Suspense fallback={<LoadingComponent />}>
              <RepairCompanyFrom
                element={props.element}
                handleHide={props.onFormHide}

                page={page}
                path={path}
              />
            </React.Suspense>
          </ErrorBoundaryForm>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default withFormRegistrySearch({})(RepairCompanyFormWrap);
