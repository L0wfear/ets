import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types/index';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type StateFieldTechnicalOperationMission = {
  TECHNICAL_OPERATION_OPTIONS: DefaultSelectListMapper<TechnicalOperationRegistry>[];
};

export type StatePropsFieldTechnicalOperationMission = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
};
export type DispatchPropsFieldTechnicalOperationMission = {
  actionGetAndSetInStoreTechnicalOperationRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistryForMission>;
  actionResetTechnicalOperationRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionResetTechnicalOperationRegistryForMission>;
};

export type OwnPropsFieldTechnicalOperationMission = {
  value: Mission['technical_operation_id'];
  name: Mission['technical_operation_name'];
  disabled: boolean;
  isPermitted: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;

  IS_TEMPLATE: boolean;
  MISSION_IS_ORDER_SOURCE: boolean;

  car_ids: Mission['car_ids'];
  for_column: Mission['for_column'];

  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationMission = (
  StatePropsFieldTechnicalOperationMission
  & DispatchPropsFieldTechnicalOperationMission
  & OwnPropsFieldTechnicalOperationMission
);
