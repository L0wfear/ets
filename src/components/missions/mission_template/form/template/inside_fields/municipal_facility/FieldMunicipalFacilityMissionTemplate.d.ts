import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import normative from 'components/directories/normative/config-data';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';

export type StateFieldMunicipalFacilityMissionTemplate = {
  MUNICIPAL_FACILITY_OPTIONS: DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>[];
};

export type StatePropsFieldMunicipalFacilityMissionTemplate = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldMunicipalFacilityMissionTemplate = {
  actionGetAndSetInStoreMunicipalFacilityRegistryForMission: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreMunicipalFacilityForMission>;
  actionResetMunicipalFacilityForMission: HandleThunkActionCreator<typeof someUniqActions.actionResetMunicipalFacilityForMission>;
};

export type OwnPropsFieldMunicipalFacilityMissionTemplate = {
  value: MissionTemplate['municipal_facility_id'];
  name: MissionTemplate['municipal_facility_name'];
  disabled: boolean;
  isPermitted: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;

  technical_operation_id: MissionTemplate['technical_operation_id'];

  page: string;
  path: string;
};

export type PropsFieldMunicipalFacilityMissionTemplate = (
  StatePropsFieldMunicipalFacilityMissionTemplate
  & DispatchPropsFieldMunicipalFacilityMissionTemplate
  & OwnPropsFieldMunicipalFacilityMissionTemplate
);
