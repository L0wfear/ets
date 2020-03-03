import * as React from 'react';
import { get } from 'lodash';

import Registry from 'components/new/ui/registry/components/Registry';
import TechMaintenanceFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { hasMotohours } from 'utils/functions';
import { CarWrap } from '../../../@types/CarForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  selectedCarData: CarWrap;
};

const TechMaintenanceList: React.FC<Props> = (props) => {
  const {
    selectedCarData,
  } = props;
  const objectExtra = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.objectExtra);
  const dispatch = etsUseDispatch();
  const car_id = get(selectedCarData, 'asuods_id', null);

  React.useEffect(
    () => {
      dispatch(registryAddInitialData(getToConfig(car_id)));
      return () => {
        dispatch(registryRemoveData(registryKey));
      };
    },
    [car_id],
  );

  const selectedCarHasMotohours = hasMotohours((get(selectedCarData, 'gov_number', '') || '').toString());

  return (
    <>
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label={selectedCarHasMotohours ? 'Срок по пробегу, м/ч:' : 'Срок до ТО по пробегу, км:'}
              readOnly
              value={get(objectExtra, 'car_interval_probeg', '') || 'Не указано'}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Срок по времени, дней:"
              readOnly
              value={get(objectExtra, 'car_interval_time', '') || 'Не указано'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
      <Registry registryKey={registryKey}>
        <TechMaintenanceFormLazy registryKey={registryKey} selectedCarData={selectedCarData} />
      </Registry>
    </>
  );
};

export default TechMaintenanceList;
