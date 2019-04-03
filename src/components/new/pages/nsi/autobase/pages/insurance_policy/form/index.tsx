import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsInsurancePolicyFormLazy } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/@types/InsurancePolicyForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const InsurancePolicyFrom = React.lazy(() =>
  import(/* webpackChunkName: "insurance_policy_form" */ 'components/new/pages/nsi/autobase/pages/insurance_policy/form/InsurancePolicyForm'),
);

const InsurancePolicyFormLazy: React.FC<PropsInsurancePolicyFormLazy> = (props) => {
  const page = props.loadingPageName || props.page;
  const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

  return props.element ? (
    <ErrorBoundaryForm>
      <React.Suspense fallback={<LoadingComponent />}>
        <InsurancePolicyFrom
          element={props.element}
          handleHide={props.onFormHide}

          page={page}
          path={path}
        />
      </React.Suspense>
    </ErrorBoundaryForm>
  ) : (
    <DivNone />
  );
};

export default withFormRegistrySearch({})(InsurancePolicyFormLazy);
