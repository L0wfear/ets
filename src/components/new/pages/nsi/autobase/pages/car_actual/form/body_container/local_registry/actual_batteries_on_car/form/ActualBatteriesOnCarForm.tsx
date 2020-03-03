import * as React from 'react';
import { Route } from 'react-router-dom';

import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';

import BatteryRegistryAddButtonData from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { ActualBatteriesOnCar } from 'redux-main/reducers/modules/autobase/actions_by_type/actual_batteries_on_car/@types';
import { WithFormRegistrySearchProps, withFormRegistrySearch, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

type Props = WithFormRegistrySearchAddProps<ActualBatteriesOnCar>;

const ActualBatteriesOnCarForm: React.FC<Props> = React.memo(
  (props) => {
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const idRaw = props.match.params[uniqKeyForParams];
    const idValue = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);

    if (idRaw) {
      if (idRaw === buttonsTypes.create) {
        return (
          <Route
            path={`${props.match.path}/:${BatteryRegistryAddButtonData.id}?`}
            render={
              (propsBattery) => {
                return  (
                  <BatteryRegistryAddButtonData.component
                    {...propsBattery}
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
          <BatteryRegistryFormLazy registryKey={props.registryKey} />
        );
      }
    }

    return null;
  },
);

export default withFormRegistrySearch<WithFormRegistrySearchProps<ActualBatteriesOnCar>, ActualBatteriesOnCar>({
  add_path: 'actual_battery_on_car',
})(ActualBatteriesOnCarForm);
