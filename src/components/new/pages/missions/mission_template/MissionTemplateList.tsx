import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_template/_config-data/registry-config';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import MissionTemplateFormWrap from 'components/new/pages/missions/mission_template/form/MissionTemplateFormWrap';

import { HandleThunkActionCreator } from "react-redux";

export type MissionTemplateListStateProps = {};
export type MissionTemplateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type MissionTemplateListOwnProps = {};
export type MissionTemplateListMergedProps = (
  MissionTemplateListStateProps
  & MissionTemplateListDispatchProps
  & MissionTemplateListOwnProps
);
export type MissionTemplateListProps = (
  MissionTemplateListMergedProps
);

const MissionTemplateList: React.FC<MissionTemplateListProps> = (props) => {
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
      <MissionTemplateFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<MissionTemplateListProps, MissionTemplateListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MissionTemplateListStateProps, MissionTemplateListDispatchProps, MissionTemplateListOwnProps, ReduxState>(
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
)(MissionTemplateList);
