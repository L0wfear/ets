import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryWaybillKey,
  config,
} from 'components/new/pages/waybill/_config-data/registry-config';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import WaybilFormlLazy from 'components/new/pages/waybill/form';

import { HandleThunkActionCreator } from "react-redux";

export type WaybillListStateProps = {};
export type WaybillListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type WaybillListOwnProps = {};
export type WaybillListMergedProps = (
  WaybillListStateProps
  & WaybillListDispatchProps
  & WaybillListOwnProps
);
export type WaybillListProps = (
  WaybillListMergedProps
);

const WaybillList: React.FC<WaybillListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);

      return () => {
        props.registryRemoveData(registryWaybillKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryWaybillKey} />
      <WaybilFormlLazy registryKey={registryWaybillKey} />
    </>
  );
};

export default compose<WaybillListProps, WaybillListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<WaybillListStateProps, WaybillListDispatchProps, WaybillListOwnProps, ReduxState>(
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
)(WaybillList);
