import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import MaterialConsumptionRateFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type MaterialConsumptionRateListStateProps = {};
export type MaterialConsumptionRateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type MaterialConsumptionRateListOwnProps = {};
export type MaterialConsumptionRateListMergedProps = (
  MaterialConsumptionRateListStateProps
  & MaterialConsumptionRateListDispatchProps
  & MaterialConsumptionRateListOwnProps
);
export type MaterialConsumptionRateListProps = (
  MaterialConsumptionRateListMergedProps
);

const MaterialConsumptionRateList: React.FC<MaterialConsumptionRateListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig());
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <MaterialConsumptionRateFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<MaterialConsumptionRateListProps, MaterialConsumptionRateListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MaterialConsumptionRateListStateProps, MaterialConsumptionRateListDispatchProps, MaterialConsumptionRateListOwnProps, ReduxState>(
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
)(MaterialConsumptionRateList);
