import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types/index';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export type StateFieldTechnicalOperationMissionTemplate = {
  TECHNICAL_OPERATION_OPTIONS: DefaultSelectListMapper<TechnicalOperationRegistry>[];
};

export type StatePropsFieldTechnicalOperationMissionTemplate = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
};
export type DispatchPropsFieldTechnicalOperationMissionTemplate = {
  actionGetAndSetInStoreTechnicalOperationRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForMission>;
  actionResetTechnicalOperationRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionResetTechnicalOperationRegistryForMission>;
};

export type OwnPropsFieldTechnicalOperationMissionTemplate = {
  value: MissionTemplate['technical_operation_id'];
  name: MissionTemplate['technical_operation_name'];
  disabled: boolean;
  isPermitted: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;
  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationMissionTemplate = (
  StatePropsFieldTechnicalOperationMissionTemplate
  & DispatchPropsFieldTechnicalOperationMissionTemplate
  & OwnPropsFieldTechnicalOperationMissionTemplate
);
