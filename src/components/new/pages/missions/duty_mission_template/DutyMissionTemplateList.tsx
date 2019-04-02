import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission_template/_config-data/registry-config';

import {
  DutyMissionTemplateListProps,
  DutyMissionTemplateListOwnProps,
  DutyMissionTemplateListDispatchProps,
  DutyMissionTemplateListStateProps,
} from 'components/new/pages/missions/duty_mission_template/DutyMissionTemplateList.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import DutyMissionTemplateFormWrap from 'components/new/pages/missions/duty_mission_template/form/DutyMissionTemplateFormWrap';

const DutyMissionTemplateList: React.FC<DutyMissionTemplateListProps> = (props) => {
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
      <DutyMissionTemplateFormWrap registryKey={registryKey} />
    </>
  );
};

export default compose<DutyMissionTemplateListProps, DutyMissionTemplateListOwnProps>(
  withPreloader({
    page: config.registryKey,
    typePreloader: 'mainpage',
  }),
  connect<DutyMissionTemplateListStateProps, DutyMissionTemplateListDispatchProps, DutyMissionTemplateListOwnProps, ReduxState>(
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
)(DutyMissionTemplateList);
