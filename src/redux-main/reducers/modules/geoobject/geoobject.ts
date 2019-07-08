import { createPath } from 'redux-main/redux-utils';
import { IStateGeoobject } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';

const GEOOBJECT = createPath('GEOOBJECT');

export const GEOOBJECT_SET_DATA = GEOOBJECT`SET_DATA`;

export const geoobjectInitialState: IStateGeoobject = {
  carpoolList: [],
  dtList: [],
  dtPolys: {},
  odhList: [],
  sspList: [],
  mspList: [],
  fuelingWaterList: [],
  fountainsList: [],
  bridgesList: [],
  dangerZoneList: [],
  pgmStoreList: [],
  snowStorageList: [],
  pedestrianTunnelsList: [],
  pedestrianTunnelExitsList: [],
};

export default (state = geoobjectInitialState, { type, payload }) => {
  switch (type) {
    case GEOOBJECT_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
