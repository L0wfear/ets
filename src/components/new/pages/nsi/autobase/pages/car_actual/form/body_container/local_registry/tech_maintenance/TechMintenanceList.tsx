import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TechMaintenanceFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import { Row, Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { get } from 'lodash';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { hasMotohours } from 'utils/functions';
import { CarWrap } from '../../../@types/CarForm';

export type TechMaintenanceListStateProps = {
  arrayExtra: OneRegistryData['list']['data']['arrayExtra'];
};
export type TechMaintenanceListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type TechMaintenanceListOwnProps = {
  selectedCarData: CarWrap;
};
export type TechMaintenanceListMergedProps = (
  TechMaintenanceListStateProps
  & TechMaintenanceListDispatchProps
  & TechMaintenanceListOwnProps
);
export type TechMaintenanceListProps = (
  TechMaintenanceListMergedProps
);

const TechMaintenanceList: React.FC<TechMaintenanceListProps> = (props) => {
  const {
    arrayExtra,
    selectedCarData,
  } = props;

  const car_id = get(selectedCarData, 'asuods_id', null);

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(car_id));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [car_id],
  );

  const selectedCarHasMotohours = hasMotohours((get(selectedCarData, 'gov_number', '') || '').toString());

  return (
    <>
      <Row>
        <Col md={12}>
          <Col md={6}>
            <ExtField
              type="string"
              label={selectedCarHasMotohours ? 'Срок по пробегу, м/ч:' : 'Срок до ТО по пробегу, км:'}
              readOnly
              value={get(arrayExtra, 'car_interval_probeg', '') || 'Не указано'}
            />
          </Col>
          <Col md={6}>
            <ExtField
              type="string"
              label="Срок по времени, дней:"
              readOnly
              value={get(arrayExtra, 'car_interval_time', '') || 'Не указано'}
            />
          </Col>
        </Col>
      </Row>
      <Registry registryKey={registryKey} />
      <TechMaintenanceFormLazy registryKey={registryKey} selectedCarData={selectedCarData} />
    </>
  );
};

export default compose<TechMaintenanceListProps, TechMaintenanceListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TechMaintenanceListStateProps, TechMaintenanceListDispatchProps, TechMaintenanceListOwnProps, ReduxState>(
    (state) => ({
      arrayExtra: getListData(getRegistryState(state), registryKey).data.arrayExtra,
    }),
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
    }),
  ),
)(TechMaintenanceList);
