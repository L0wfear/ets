import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

const InsurancePolicyFromReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "insurance_policy_form" */ 'components/new/pages/nsi/autobase/pages/insurance_policy/form/InsurancePolicyForm'),
);

const InsurancePolicyFormLazy: React.FC<WithFormRegistrySearchAddProps<InsurancePolicy> & { selectedCarData?: CarWrap }> = React.memo(
  (props) => {
    const element = React.useMemo(
      () => {
        if (!props.element.car_id && props.selectedCarData) {
          return {
            ...props.element,
            car_id: props.selectedCarData.asuods_id,
            car_gov_number: props.selectedCarData.gov_number,
          };
        }

        return props.element;
      },
      [props.element, props.selectedCarData],
    );

    return (
      <InsurancePolicyFromReactLazy
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<InsurancePolicy> & { selectedCarData?: CarWrap }, InsurancePolicy>({
  add_path: 'insurance-policy',
})(InsurancePolicyFormLazy);
