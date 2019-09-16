import * as React from 'react';

import { WithFormRegistrySearchProps, withFormRegistrySearch, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

const TechInspectionFromReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "tech_inspection_form" */ 'components/new/pages/nsi/autobase/pages/tech_inspection/form/TechInspectionForm'),
);

const TechInspectionFormLazy: React.FC<WithFormRegistrySearchAddProps<TechInspection> & { selectedCarData?: CarWrap }> = React.memo(
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
      <TechInspectionFromReactLazy
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<TechInspection> & { selectedCarData?: CarWrap }, TechInspection>({
  add_path: 'tech_inspection',
})(TechInspectionFormLazy);
