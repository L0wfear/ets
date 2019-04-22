import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type StateFieldMunicipalFacilityIdMission = {
  MUNICIPAL_FACILITY_OPTIONS: DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>[];
};

export type StatePropsFieldMunicipalFacilityIdMission = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
};
export type DispatchPropsFieldMunicipalFacilityIdMission = {
  actionGetAndSetInStoreMunicipalFacilityForMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreMunicipalFacilityForMission>;
  actionResetMunicipalFacilityForMission: HandleThunkActionCreator<typeof someUniqActions.actionResetMunicipalFacilityForMission>;
};

export type OwnPropsFieldMunicipalFacilityIdMission = {
  value: Mission['municipal_facility_id'];
  name: Mission['municipal_facility_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string | void;
  onChange: (obj: Record<any, any>) => void;

  technical_operation_id: Mission['technical_operation_id'];
  date_start: Mission['date_start'];

  IS_TEMPLATE: boolean;
  MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type PropsFieldMunicipalFacilityIdMission = (
  StatePropsFieldMunicipalFacilityIdMission
  & DispatchPropsFieldMunicipalFacilityIdMission
  & OwnPropsFieldMunicipalFacilityIdMission
);
