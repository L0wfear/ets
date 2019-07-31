import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission_archive/_config-data/registry-config';

import {
  DutyMissionArchiveListProps,
  DutyMissionArchiveListOwnProps,
  DutyMissionArchiveListDispatchProps,
  DutyMissionArchiveListStateProps,
} from 'components/new/pages/missions/duty_mission_archive/DutyMissionArchiveList.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import DutyMissionArchiveListFormWrap from 'components/new/pages/missions/duty_mission_archive/form/main/DutyMissionArchiveListFormWrap';

const DutyMissionArchiveList: React.FC<DutyMissionArchiveListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(config);

      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <DutyMissionArchiveListFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<DutyMissionArchiveListProps, DutyMissionArchiveListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<DutyMissionArchiveListStateProps, DutyMissionArchiveListDispatchProps, DutyMissionArchiveListOwnProps, ReduxState>(
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
)(DutyMissionArchiveList);
