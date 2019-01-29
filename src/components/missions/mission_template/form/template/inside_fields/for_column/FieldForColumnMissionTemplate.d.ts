import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import normative from 'components/directories/normative/config-data';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type StateFieldForColumnMissionTemplate = {
  carList: Car[];
};

export type StatePropsFieldForColumnMissionTemplate = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldForColumnMissionTemplate = {
};

export type OwnPropsFieldForColumnMissionTemplate = {
  value: MissionTemplate['for_column'];
  error: string | void;
  disabled: boolean;
  onChange: (obj: { [key: string]: any }) => any;

  municipal_facility_id: MissionTemplate['municipal_facility_id'];

  page: string;
  path: string;
};

export type PropsFieldForColumnMissionTemplate = (
  StatePropsFieldForColumnMissionTemplate
  & DispatchPropsFieldForColumnMissionTemplate
  & OwnPropsFieldForColumnMissionTemplate
);
