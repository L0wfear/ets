import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

export type StateFieldTechnicalOperationDutyMissionTemplate = {
  TECHNICAL_OPERATION_OPTIONS: DefaultSelectListMapper<TechnicalOperationRegistry>[];
};

export type StatePropsFieldTechnicalOperationDutyMissionTemplate = {
  technicalOperationRegistryForDutyMissionList: IStateSomeUniq['technicalOperationRegistryForDutyMissionList'];
};
export type DispatchPropsFieldTechnicalOperationDutyMissionTemplate = {
  actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission>;
  actionResetTechnicalOperationRegistryForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionResetTechnicalOperationRegistryForDutyMission>;
};

export type OwnPropsFieldTechnicalOperationDutyMissionTemplate = {
  value: DutyMissionTemplate['technical_operation_id'];
  name: DutyMissionTemplate['technical_operation_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key in keyof DutyMissionTemplate]?: DutyMissionTemplate[key] }) => void;

  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationDutyMissionTemplate = (
  StatePropsFieldTechnicalOperationDutyMissionTemplate
  & DispatchPropsFieldTechnicalOperationDutyMissionTemplate
  & OwnPropsFieldTechnicalOperationDutyMissionTemplate
);
