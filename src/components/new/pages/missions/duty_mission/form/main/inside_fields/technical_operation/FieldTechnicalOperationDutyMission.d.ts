import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

export type StateFieldTechnicalOperationDutyMission = {
  TECHNICAL_OPERATION_OPTIONS: DefaultSelectListMapper<TechnicalOperationRegistry>[];
};

export type StatePropsFieldTechnicalOperationDutyMission = {
  technicalOperationRegistryForDutyMissionList: IStateSomeUniq['technicalOperationRegistryForDutyMissionList'];
};
export type DispatchPropsFieldTechnicalOperationDutyMission = {
  actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForDutyMission>;
  actionResetTechnicalOperationRegistryForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionResetTechnicalOperationRegistryForDutyMission>;
};

export type OwnPropsFieldTechnicalOperationDutyMission = {
  value: DutyMission['technical_operation_id'];
  name: DutyMission['technical_operation_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  IS_TEMPLATE: boolean;
  DUTY_MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationDutyMission = (
  StatePropsFieldTechnicalOperationDutyMission
  & DispatchPropsFieldTechnicalOperationDutyMission
  & OwnPropsFieldTechnicalOperationDutyMission
);
