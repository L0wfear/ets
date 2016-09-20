import { handleActions } from 'redux-actions';
import keyBy from 'lodash/keyBy';

const SET_SHOW_PLATES = 'ets/settings/setShowPlates';

const initialState = {
  showPlates: false,
  showTrack: true,
  showPolygons: true,
  showSelectedElement: true,
  showGeoobjects: false,
  showMarkers: true,
};

export default handleActions({
  [SET_SHOW_PLATES]: {
    next(state, { payload }) {
      return {
        ...state,
        typesList: payload,
        typesIndex: keyBy(payload, 'id'),
      };
    },
    throw() {
    },
  },
}, initialState);
