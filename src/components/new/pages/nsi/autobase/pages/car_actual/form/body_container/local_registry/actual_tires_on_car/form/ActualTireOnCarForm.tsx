import * as React from 'react';
import { Route } from 'react-router-dom';

import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

import TireRegistryAddButtonData from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/form/car_actual_add_tire_registry_form/_config-data';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import TireFormLazy from 'components/new/pages/nsi/autobase/pages/tire/form';
import { WithFormRegistrySearchProps, withFormRegistrySearchNew, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { ActualTiresOnCar } from 'redux-main/reducers/modules/autobase/actions_by_type/actual_tires_on_car/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

type Props = WithFormRegistrySearchAddProps<ActualTiresOnCar>;

const ActualTireOnCarForm: React.FC<Props> = React.memo(
  (props) => {
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const idRaw = props.match.params[uniqKeyForParams];
    const idValue = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);

    if (idRaw) {
      if (idRaw === buttonsTypes.create) {
        return (
          <Route
            path={`${props.match.path}/:${TireRegistryAddButtonData.id}?`}
            render={
              (propsTire) => {
                return  (
                  <TireRegistryAddButtonData.component
                    {...propsTire}
                    page={props.page}
                    handleHide={props.handleHide}
                  />
                );
              }
            }
          />
        );
      }
      if (!isNaN(idValue)) {
        return (
          <TireFormLazy registryKey={props.registryKey} />
        );
      }
    }

    return null;
  },
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<ActualTiresOnCar>, ActualTiresOnCar>({
  add_path: 'actual_tire_on_car',
})(ActualTireOnCarForm);
