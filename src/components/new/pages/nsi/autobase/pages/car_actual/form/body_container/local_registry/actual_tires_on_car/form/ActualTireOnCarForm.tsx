import * as React from 'react';

import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { Route } from 'react-router-dom';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import TireRegistryAddButtonData from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/form/car_actual_add_tire_registry_form/_config-data';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import TireFormLazy from 'components/new/pages/nsi/autobase/pages/tire/form';

type Props = {
  [k: string]: any;
} & WithSearchProps;

const ActualTireOnCarForm: React.FC<Props> = React.memo(
  (props) => {
    const { data: { uniqKeyForParams } } = props;
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
          <TireFormLazy registryKey={props.registryKey} />
        );
      }
    }

    return null;
  },
);

export default withFormRegistrySearch({})(ActualTireOnCarForm);
