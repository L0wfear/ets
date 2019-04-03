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

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export type InsurancePolicyListStateProps = {};
export type InsurancePolicyListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type InsurancePolicyListOwnProps = {};
export type InsurancePolicyListMergedProps = (
  InsurancePolicyListStateProps
  & InsurancePolicyListDispatchProps
  & InsurancePolicyListOwnProps
);
export type InsurancePolicyListProps = (
  InsurancePolicyListMergedProps
) & WithSearchProps;

const InsurancePolicyList: React.FC<InsurancePolicyListProps> = (props) => {
  const car_id = getNumberValueFromSerch(props.match.params.car_actual_asuods_id);

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
      <InsurancePolicyFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<InsurancePolicyListProps, InsurancePolicyListOwnProps>(
  withSearch,
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
