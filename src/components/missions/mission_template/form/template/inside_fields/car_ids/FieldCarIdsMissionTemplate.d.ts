import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import normative from 'components/directories/normative/config-data';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type StateFieldCarIdsMissionTemplate = {
  carList: Car[];
  carIndex: {
    [asuods_id: string]: Car;
  };
};

export type StatePropsFieldCarIdsMissionTemplate = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldCarIdsMissionTemplate = {
  autobaseGetSetCar: any;
};

export type OwnPropsFieldCarIdsMissionTemplate = {
  value: MissionTemplate['car_ids'];
  error: string | void;
  disabled: boolean;
  onChange: (obj: { [key: string]: any }) => any;

  for_column: MissionTemplate['for_column'];
  municipal_facility_id: MissionTemplate['municipal_facility_id'];
  structure_id: MissionTemplate['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldCarIdsMissionTemplate = (
  StatePropsFieldCarIdsMissionTemplate
  & DispatchPropsFieldCarIdsMissionTemplate
  & OwnPropsFieldCarIdsMissionTemplate
);
