import { GeozoneMunicipalFacilityService } from 'api/Services';
import { polyState } from 'constants/polygons';
import { keyBy, get } from 'lodash';

export const promiseGetGeozoneMunicipalFacility = async (payloadOwn) => {
  let response = null;

  const payload = { ...payloadOwn };
  if (!payloadOwn.structure_id) {
    delete payloadOwn.structure_id;
  }

  try {
    response = await GeozoneMunicipalFacilityService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, 'result', []);

  const geozone_municipal_facility = data.map((geo) => {
    try {
      geo.shape = JSON.parse(geo.shape);
    } catch {
      geo.shape = {};
    }
    geo.state = polyState.ENABLE;

    return geo;
  });

  return {
    data: {
      list: geozone_municipal_facility,
      byId: keyBy(geozone_municipal_facility, 'id'),
    },
  };
};
