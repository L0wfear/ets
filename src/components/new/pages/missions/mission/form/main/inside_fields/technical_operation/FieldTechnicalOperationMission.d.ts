import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types/index';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type StateFieldTechnicalOperationMission = {
  TECHNICAL_OPERATION_OPTIONS: Array<DefaultSelectListMapper<TechnicalOperationRegistry>>;
};

export type StatePropsFieldTechnicalOperationMission = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
};
export type DispatchPropsFieldTechnicalOperationMission = {
  dispatch: EtsDispatch;
  actionResetTechnicalOperationRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionResetTechnicalOperationRegistryForMission>;
};

export type OwnPropsFieldTechnicalOperationMission = {
  value: Mission['technical_operation_id'];
  name: Mission['technical_operation_name'];
  disabled: boolean;
  isPermitted: boolean;
  error: string;
  onChange: (obj: { [key: string]: any; }) => any;

  IS_TEMPLATE: boolean;
  MISSION_IS_ORDER_SOURCE: boolean;

  car_ids: Mission['car_ids'];
  for_column: Mission['for_column'];
  order_operation_id?: Mission['order_operation_id'];

  page: string;
  path: string;
};

export type PropsFieldTechnicalOperationMission = (
  StatePropsFieldTechnicalOperationMission
  & DispatchPropsFieldTechnicalOperationMission
  & OwnPropsFieldTechnicalOperationMission
);
