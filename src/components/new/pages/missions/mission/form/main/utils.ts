import {
  get,
} from 'lodash';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export const getAvailableRouteTypes = (
  municipalFacilityForMissionList: Array<MunicipalFacility>,
  municipal_facility_id: Mission['municipal_facility_id'] | MissionTemplate['municipal_facility_id'],
  for_column?: boolean,
) => {
  if (for_column) {
    return ['mixed'];
  }

  return get(
    municipalFacilityForMissionList.find(
      (mfData) => (
        mfData.municipal_facility_id === municipal_facility_id
      ),
    ),
    'route_types',
    [],
  );
};
