import { actionsFactory, handleActions } from 'redux/utils/actions';
import { loadGeozoneByTypeWithGeometry, clearDataInGeometryByType, clearAllDataInGeometry, showAllDataInGeometry } from 'redux/modules/geoObjects';
import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_REVERSE } from 'constants/geoobjects';

const PATH = 'ets/toolbar';
const createAction = actionsFactory(PATH);

export const SET_INITIAL_STATE_IN_TOOLBAR = 'setInitialStateInToolbar';

export const TOGGLE_SHOW_ACTIVE = 'toggleShowActive';
export const TOGGLE_SHOW_IN_MOVE = 'toggleShowInMove';
export const TOGGLE_SHOW_IN_HALF_STOP = 'toggleShowInHalfSTop';
export const TOGGLE_SHOW_IN_STOP = 'toggleShowInStop';
export const TOGGLE_SHOW_IN_NOT_CONNECTED = 'toggleShowInNotConnected';

export const TOGGLE_SHOW_TRACK = 'toggleShowTrack';
export const TOGGLE_SHOW_GEOMETRY = 'toggleShowGeometry';

export const TOGGLE_SHOW_GOS_NUMBER = 'toggleShowGovNumber';

export const TOGGLE_FILTER_GEO_OBJECT = 'toggleFilterGeoObjects';
export const HIDE_ALL_FILTER_GEOOBJECT = 'hideAllFiltreGeoobject';
export const SHOW_ALL_FILTER_GEOOBJECT = 'showAllFiltreGeoobject';

const initialState = {
  filtersCars: {
    showActive: true,
    showInMove: true,
    showInHalfStop: true,
    showInStop: true,
    showInNotConnected: true,
  },
  filtersOthers: {
    showTrack: true,
    showGeometry: true,
  },
  showGovNumber: false,
  filtersGeoObjects: {
    [GEOOBJECTS_TYPES.dt]: false,
    [GEOOBJECTS_TYPES.odh]: false,
    [GEOOBJECTS_TYPES.ssp]: false,
    [GEOOBJECTS_TYPES.msp]: false,
    [GEOOBJECTS_TYPES.carpool]: false,
    [GEOOBJECTS_TYPES.fueling_water]: false,
    [GEOOBJECTS_TYPES.danger_zone]: false,
    [GEOOBJECTS_TYPES.pgm_store]: false,
    [GEOOBJECTS_TYPES.snow_storage]: false,
    [GEOOBJECTS_TYPES.bridges]: false,
    [GEOOBJECTS_TYPES.pedestrian_tunnels]: false,
    [GEOOBJECTS_TYPES.pedestrian_tunnel_exits]: false,
    [GEOOBJECTS_TYPES.fountains]: false,
  },
};
export const setInitialStateInToolbar = createAction(SET_INITIAL_STATE_IN_TOOLBAR);

export const toggleShowActive = createAction(TOGGLE_SHOW_ACTIVE);
export const toggleShowInMove = createAction(TOGGLE_SHOW_IN_MOVE);
export const toggleShowInHalfSTop = createAction(TOGGLE_SHOW_IN_HALF_STOP);
export const toggleShowInStop = createAction(TOGGLE_SHOW_IN_STOP);
export const toggleShowInNotConnected = createAction(TOGGLE_SHOW_IN_NOT_CONNECTED);

export const toggleShowTrack = createAction(TOGGLE_SHOW_TRACK);
export const toggleShowGeometry = createAction(TOGGLE_SHOW_GEOMETRY);

export const toggleShowGovNumber = createAction(TOGGLE_SHOW_GOS_NUMBER);

export const toggleFilterGeoObjects = createAction(TOGGLE_FILTER_GEO_OBJECT);
export const hideAllFiltreGeoobject = createAction(HIDE_ALL_FILTER_GEOOBJECT);
export const showAllFiltreGeoobject = createAction(SHOW_ALL_FILTER_GEOOBJECT);

export const toggleGeoobject = type => (dispatch, getState) => {
  const { toolbar: { filtersGeoObjects } } = getState();
  const value = !filtersGeoObjects[type];

  if (value) {
    dispatch(loadGeozoneByTypeWithGeometry({ type }));
  } else {
    dispatch(clearDataInGeometryByType({ type }));
  }
  dispatch(toggleFilterGeoObjects({ filter: type, value }));
};

export const toggleShowAllGeometry = active => (dispatch, getState) =>{
  if (!active) {
    dispatch(clearAllDataInGeometry());
    dispatch(hideAllFiltreGeoobject());
  } else {
    dispatch(showAllDataInGeometry());
    const {
      toolbar: { filtersGeoObjects },
      session: { permissions } } = getState();
    const whatToShow = Object.keys(filtersGeoObjects).reduce((newObj, key) => {
      if (permissions.includes(`${GEOOBJECTS_TYPES_REVERSE[key]}.list`)) {
        newObj[key] = true;
      }

      return newObj;
    }, {});

    dispatch(showAllFiltreGeoobject(whatToShow));
  }
};

const reducer = handleActions({
  [setInitialStateInToolbar]: () => ({ ...initialState }),
  [toggleShowActive]: state => ({
    ...state,
    filtersCars: {
      ...state.filtersCars,
      showActive: !state.filtersCars.showActive,
    },
  }),
  [toggleShowInMove]: state => ({
    ...state,
    filtersCars: {
      ...state.filtersCars,
      showInMove: !state.filtersCars.showInMove,
    },
  }),
  [toggleShowInHalfSTop]: state => ({
    ...state,
    filtersCars: {
      ...state.filtersCars,
      showInHalfStop: !state.filtersCars.showInHalfStop,
    },
  }),
  [toggleShowInStop]: state => ({
    ...state,
    filtersCars: {
      ...state.filtersCars,
      showInStop: !state.filtersCars.showInStop,
    },
  }),
  [toggleShowInNotConnected]: state => ({
    ...state,
    filtersCars: {
      ...state.filtersCars,
      showInNotConnected: !state.filtersCars.showInNotConnected,
    },
  }),
  [toggleShowTrack]: state => ({
    ...state,
    filtersOthers: {
      ...state.filtersOthers,
      showTrack: !state.filtersOthers.showTrack,
    },
  }),
  [toggleShowGeometry]: state => ({
    ...state,
    filtersOthers: {
      ...state.filtersOthers,
      showGeometry: !state.filtersOthers.showGeometry,
    },
  }),
  [toggleShowGovNumber]: state => ({
    ...state,
    showGovNumber: !state.showGovNumber,
  }),
  [toggleFilterGeoObjects]: (state, { payload: { filter, value } }) => ({
    ...state,
    filtersGeoObjects: {
      ...state.filtersGeoObjects,
      [filter]: value,
    },
  }),
  [hideAllFiltreGeoobject]: state => ({
    ...state,
    filtersGeoObjects: {
      ...initialState.filtersGeoObjects,
    },
  }),
  [showAllFiltreGeoobject]: (state, { payload }) => ({
    ...state,
    filtersGeoObjects: {
      ...state.filtersGeoObjects,
      ...payload,
    },
  }),
}, initialState);

export default reducer;
