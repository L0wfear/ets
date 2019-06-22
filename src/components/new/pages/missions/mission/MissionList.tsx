import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission/_config-data/registry-config';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import MissionListFormWrap from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';

import { HandleThunkActionCreator } from "react-redux";

export type MissionListStateProps = {};
export type MissionListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>;
};
export type MissionListOwnProps = {};
export type MissionListMergedProps = (
  MissionListStateProps
  & MissionListDispatchProps
  & MissionListOwnProps
);
export type MissionListProps = (
  MissionListMergedProps
);

const MissionList: React.FC<MissionListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);
      props.actionUnselectSelectedRowToShow(registryKey, true);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <MissionListFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<MissionListProps, MissionListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MissionListStateProps, MissionListDispatchProps, MissionListOwnProps, ReduxState>(
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
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(MissionList);
