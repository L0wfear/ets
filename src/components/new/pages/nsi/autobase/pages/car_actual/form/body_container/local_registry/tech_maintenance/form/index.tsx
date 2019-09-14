import * as React from 'react';

import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithFormRegistrySearchProps, withFormRegistrySearch, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

const TechMintenanceForm = React.lazy(() =>
  import(/* webpackChunkName: "tech_maint_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/TechMintenanceForm'),
);

const TechMaintenanceFormLazy: React.FC<WithFormRegistrySearchAddProps<TechMaintenance> & { selectedCarData?: CarWrap }> = React.memo(
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
      <TechMintenanceForm
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<TechMaintenance> & { selectedCarData?: CarWrap }, TechMaintenance>({
  add_path: 'tech_maintenance',
})(TechMaintenanceFormLazy);
