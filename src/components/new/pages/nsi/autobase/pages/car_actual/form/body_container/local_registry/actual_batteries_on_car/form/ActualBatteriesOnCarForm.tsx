import * as React from 'react';

import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';
import { Route } from 'react-router-dom';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import BatteryRegistryAddButtonData from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type Props = {
  [k: string]: any;
} & WithSearchProps;

const ActualBatteriesOnCarForm: React.FC<Props> = React.memo(
  (props) => {
    const { data: { uniqKeyForParams } } = props;
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
                    handleHide={props.onFormHide}
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

export default withFormRegistrySearch({})(ActualBatteriesOnCarForm);
