import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchAddProps, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

const RepareFromReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "repare_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form/RepairForm'),
);

const RepareFormLazy: React.FC<WithFormRegistrySearchAddProps<Repair> & { selectedCarData?: CarWrap }> = React.memo(
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
      <RepareFromReactLazy
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<Repair> & { selectedCarData?: CarWrap }, Repair>({
  add_path: 'repair',
})(RepareFormLazy);
