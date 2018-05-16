import { actionsFactory, handleActions, handlePayload } from 'redux/utils/actions';

import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_REVERSE } from 'constants/geoobjects.js';
import {
  GeozonesService,
  GormostService,
} from 'api/Services';

const PATH = 'ets/geoObjects';
const createAction = actionsFactory(PATH);

const SET_GEOMETRY_BY_TYPE = 'setGeometryByType';
const SELECT_GEOMETRY = 'selectGeometry';
const CLEAR_DATA_IN_GEOMETRY_BY_TYPE = 'clearDataInGeometryByType';
const CLEAR_ALL_DATA_IN_GEOMETRY = 'clearAllDataInGeometry';

const initialState = {
  geoData: {
    [GEOOBJECTS_TYPES.dt]: [],
    [GEOOBJECTS_TYPES.odh]: [],
    [GEOOBJECTS_TYPES.ssp]: [],
    [GEOOBJECTS_TYPES.msp]: [],
    [GEOOBJECTS_TYPES.carpool]: [],
    [GEOOBJECTS_TYPES.fueling_water]: [],
    [GEOOBJECTS_TYPES.danger_zone]: [],
    [GEOOBJECTS_TYPES.pgm_store]: [],
    [GEOOBJECTS_TYPES.snow_storage]: [],
    [GEOOBJECTS_TYPES.bridges]: [],
    [GEOOBJECTS_TYPES.pedestrian_tunnels]: [],
    [GEOOBJECTS_TYPES.pedestrian_tunnel_exits]: [],
    [GEOOBJECTS_TYPES.fountains]: [],
  },
  fuelEvents: {
  },
  selected: false,
};

const noNeedShapeInPayload = [
  'bridges',
  'pedestrian_tunnels',
  'pedestrian_tunnel_exits',
  'fountains',
];

export const setGeometryByType = createAction(SET_GEOMETRY_BY_TYPE);
export const selectGeometry = createAction(SELECT_GEOMETRY,
  (type, data) => type ? { type, data } : false);

export const clearDataInGeometryByType = createAction(CLEAR_DATA_IN_GEOMETRY_BY_TYPE);

export const loadGeozoneByTypeWithGeometry = props => (dispatch) => {
  const {
    type,
    payload: outer_payload,
  } = props;

  const payload = {
    ...outer_payload,
  };
  if (noNeedShapeInPayload.includes(type)) {
    return GormostService.path(GEOOBJECTS_TYPES_REVERSE[type]).get(payload).then(({ result: { rows } }) => {
      const value = rows.map(geoObject => ({
        ...geoObject,
        shape: typeof geoObject.shape === 'string' ? JSON.parse(geoObject.shape) : geoObject.shape,
      }));

      dispatch(setGeometryByType({ type, value }));
    });
  } else {
    payload.shape = 1;
    return GeozonesService.path(GEOOBJECTS_TYPES_REVERSE[type]).get(payload).then(({ result: { rows } }) => {
      const value = rows.map(geoObject => ({
        ...geoObject,
        shape: typeof geoObject.shape === 'string' ? JSON.parse(geoObject.shape) : geoObject.shape,
      }));

      dispatch(setGeometryByType({ type, value }));
    });
  }
};

export const clearAllDataInGeometry = createAction(CLEAR_ALL_DATA_IN_GEOMETRY);
export const showAllDataInGeometry = () => (dispatch, getState) => {
  const {
    geoObjects: { geoData },
    session: { permissions },
  } = getState();

  Object.entries(geoData).forEach(([key, val]) => {
    if (permissions.includes(`${GEOOBJECTS_TYPES_REVERSE[key]}.list`)) {
      if (val.length > 0) {
        return;
      }
      dispatch(loadGeozoneByTypeWithGeometry({ type: key }));
    }
  });
};

const reducer = handleActions({
  [setGeometryByType]: (state, { payload: { type, value }}) => ({
    ...state,
    geoData: {
      ...state.geoData,
      [type]: value,
    },
  }),
  [selectGeometry]: handlePayload('selected'),
  [clearDataInGeometryByType]: (state, { payload: { type } }) => ({
    ...state,
    geoData: {
      ...state.geoData,
      [type]: [],
    },
  }),
  [clearAllDataInGeometry]: state => ({
    ...state,
    geoData: {
      ...initialState.geoData,
    },
  }),
}, initialState);

export default reducer;
