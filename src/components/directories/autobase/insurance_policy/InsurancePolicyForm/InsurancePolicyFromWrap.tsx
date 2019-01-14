import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import { PropsInsurancePolicyFormWrap } from 'components/directories/autobase/insurance_policy/InsurancePolicyForm/@types/InsurancePolicy.h';

const InsurancePolicyFrom = React.lazy(() => (
  import(/* webpackChunkName: "insurance_policy_form" */ 'components/directories/autobase/insurance_policy/InsurancePolicyForm/InsurancePolicyForm')
));

class InsurancePolicyFormWrap extends React.Component<PropsInsurancePolicyFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}insurance-policy-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <InsurancePolicyFrom
            element={props.element}
            handleHide={props.onFormHide}
            car_id={props.car_id}

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

export default InsurancePolicyFormWrap;
