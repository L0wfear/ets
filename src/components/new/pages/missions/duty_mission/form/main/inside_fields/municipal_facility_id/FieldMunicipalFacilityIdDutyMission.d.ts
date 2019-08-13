import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export type StateFieldMunicipalFacilityIdDutyMission = {
  MUNICIPAL_FACILITY_OPTIONS: DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>[];
};

export type StatePropsFieldMunicipalFacilityIdDutyMission = {
  municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList'];
  technicalOperationRegistryForDutyMissionList: IStateSomeUniq['technicalOperationRegistryForDutyMissionList'];
};
export type DispatchPropsFieldMunicipalFacilityIdDutyMission = {
  actionGetAndSetInStoreMunicipalFacilityForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreMunicipalFacilityForDutyMission>;
  actionResetMunicipalFacilityForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionResetMunicipalFacilityForDutyMission>;
};

export type OwnPropsFieldMunicipalFacilityIdDutyMission = {
  value: DutyMission['municipal_facility_id'];
  name: DutyMission['municipal_facility_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  technical_operation_id: DutyMission['technical_operation_id'];

  IS_TEMPLATE: boolean;
  DUTY_MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type PropsFieldMunicipalFacilityIdDutyMission = (
  StatePropsFieldMunicipalFacilityIdDutyMission
  & DispatchPropsFieldMunicipalFacilityIdDutyMission
  & OwnPropsFieldMunicipalFacilityIdDutyMission
);
