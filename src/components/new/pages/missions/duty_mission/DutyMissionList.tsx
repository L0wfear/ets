import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission/_config-data/registry-config';

import {
  DutyMissionListProps,
  DutyMissionListOwnProps,
  DutyMissionListDispatchProps,
  DutyMissionListStateProps,
} from 'components/new/pages/missions/duty_mission/DutyMissionList.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import DutyMissionListFormWrap from 'components/new/pages/missions/duty_mission/form/main/DutyMissionListFormWrap';

const DutyMissionList: React.FC<DutyMissionListProps> = (props) => {
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
      <DutyMissionListFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<DutyMissionListProps, DutyMissionListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<DutyMissionListStateProps, DutyMissionListDispatchProps, DutyMissionListOwnProps, ReduxState>(
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
)(DutyMissionList);
