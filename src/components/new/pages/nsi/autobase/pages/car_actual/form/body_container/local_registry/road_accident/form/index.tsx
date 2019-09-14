import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchAddProps, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';

const RoadAccidentFromReactLazy = React.lazy(() =>
  import(/* webpackChunkName: "road_accident_form" */ 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/RoadAccidentForm'),
);

const RoadAccidentFormLazy: React.FC<WithFormRegistrySearchAddProps<RoadAccident> & { selectedCarData?: CarWrap }> = React.memo(
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
      <RoadAccidentFromReactLazy
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<RoadAccident> & { selectedCarData?: CarWrap }, RoadAccident>({
  add_path: 'road_accident',
})(RoadAccidentFormLazy);
