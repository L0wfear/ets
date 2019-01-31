import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type StateFieldMunicipalFacilityIdDutyMissionTemplate = {
  MUNICIPAL_FACILITY_OPTIONS: DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>[];
};

export type StatePropsFieldMunicipalFacilityIdDutyMissionTemplate = {
  municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList'];
  technicalOperationRegistryForDutyMissionList: IStateSomeUniq['technicalOperationRegistryForDutyMissionList'];
};
export type DispatchPropsFieldMunicipalFacilityIdDutyMissionTemplate = {
  actionGetAndSetInStoreMunicipalFacilityForDutyMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreMunicipalFacilityForDutyMission>;
};

export type OwnPropsFieldMunicipalFacilityIdDutyMissionTemplate = {
  value: DutyMissionTemplate['municipal_facility_id'];
  name: DutyMissionTemplate['municipal_facility_name'];
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key in keyof DutyMissionTemplate]?: DutyMissionTemplate[key] }) => void;

  technical_operation_id: DutyMissionTemplate['technical_operation_id'];

  page: string;
  path: string;
};

export type PropsFieldMunicipalFacilityIdDutyMissionTemplate = (
  StatePropsFieldMunicipalFacilityIdDutyMissionTemplate
  & DispatchPropsFieldMunicipalFacilityIdDutyMissionTemplate
  & OwnPropsFieldMunicipalFacilityIdDutyMissionTemplate
);
