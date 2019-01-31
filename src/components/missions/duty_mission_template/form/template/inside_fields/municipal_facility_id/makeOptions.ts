import memoize from 'memoize-one';

import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export const makeOptionsByMunicipalFacilityIdRegistryForMissionList = (
  memoize(
    (municipalFacilityIdRegistryForMissionList: MunicipalFacility[]) => (
      municipalFacilityIdRegistryForMissionList
        .map<DefaultSelectOption<MunicipalFacility['municipal_facility_id'], MunicipalFacility['municipal_facility_name'], MunicipalFacility>>((mfData) => ({
          value: mfData.municipal_facility_id,
          label: mfData.municipal_facility_name,
          rowData: mfData,
        }))
    ),
  )
);
