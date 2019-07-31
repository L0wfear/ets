import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import InsurancePolicyFormLazy from 'components/new/pages/nsi/autobase/pages/insurance_policy/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { CarWrap } from '../car_actual/form/@types/CarForm';
import { get } from 'lodash';

export type InsurancePolicyListStateProps = {};
export type InsurancePolicyListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type InsurancePolicyListOwnProps = {
  selectedCarData: CarWrap;
};
export type InsurancePolicyListMergedProps = (
  InsurancePolicyListStateProps
  & InsurancePolicyListDispatchProps
  & InsurancePolicyListOwnProps
);
export type InsurancePolicyListProps = (
  InsurancePolicyListMergedProps
);

const InsurancePolicyList: React.FC<InsurancePolicyListProps> = (props) => {
  const {
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

  return (
    <>
      <Registry registryKey={registryKey} />
      <InsurancePolicyFormLazy
        registryKey={registryKey}
        selectedCarData={selectedCarData}
      />
    </>
  );
};

export default compose<InsurancePolicyListProps, InsurancePolicyListOwnProps>(
  withPreloader({
    page: getToConfig().registryKey,
    typePreloader: 'mainpage',
  }),
  connect<InsurancePolicyListStateProps, InsurancePolicyListDispatchProps, InsurancePolicyListOwnProps, ReduxState>(
    null,
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
)(InsurancePolicyList);
