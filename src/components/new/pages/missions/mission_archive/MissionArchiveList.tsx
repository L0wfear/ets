import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_archive/_config-data/registry-config';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import MissionArchiveListFormWrap from 'components/new/pages/missions/mission_archive/form/main/MissionArchiveListFormWrap';

import { HandleThunkActionCreator } from "react-redux";
import { registryAddInitialData, registryRemoveData } from "components/new/ui/registry/module/actions-registy";

export type MissionArchiveListStateProps = {};
export type MissionArchiveListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type MissionArchiveListOwnProps = {};
export type MissionArchiveListMergedProps = (
  MissionArchiveListStateProps
  & MissionArchiveListDispatchProps
  & MissionArchiveListOwnProps
);
export type MissionArchiveListProps = (
  MissionArchiveListMergedProps
);

const MissionArchiveList: React.FC<MissionArchiveListProps> = (props) => {
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
      <MissionArchiveListFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<MissionArchiveListProps, MissionArchiveListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MissionArchiveListStateProps, MissionArchiveListDispatchProps, MissionArchiveListOwnProps, ReduxState>(
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
)(MissionArchiveList);
