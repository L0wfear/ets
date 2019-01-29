import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import normative from 'components/directories/normative/config-data';
export type StateFieldMunicipalFacilityMissionTemplate = {
};

export type StatePropsFieldMunicipalFacilityMissionTemplate = {
  technicalOperationRegistryForMissionList: IStateSomeUniq['technicalOperationRegistryForMissionList'];
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldMunicipalFacilityMissionTemplate = {
  actionGetAndSetInStoreMunicipalFacilityRegistryForMission: any;
};

export type OwnPropsFieldMunicipalFacilityMissionTemplate = {
  value: MissionTemplate['municipal_facility_id'];
  name: MissionTemplate['municipal_facility_name'];
  disabled: boolean;
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
