import Raven from 'raven-js';

import { actionsFactory, handleActions, handlePayload } from 'redux/utils/actions';
import { addPointToTrack } from 'redux/modules/oneCarInfo';

import config from 'components/../config.js';
import ReconnectingWebSocket from 'vendor/ReconnectingWebsocket.js';


const PATH = 'ets/carsPoint';
const createAction = actionsFactory(PATH);

const SET_WS = 'setWs';
const UPDATE_POINTS = 'updatePoints';
const CLOSE_WS_TO_GET_DATA = 'closeWs';
const SET_SELECTED_CAR = 'setSelectedCar';
const SET_ALL_LAST_UPDATE = 'setAllLastUpdate';
const initialState = {
  byStatus: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  },
  byConnectionStatus: {
    0: 0,
    1: 0,
  },
  carsData: {},
  lastUpdateCar: [],
  selectedCarId: '',
  ws: null,
};

export const setWs = createAction(SET_WS);
export const closeWs = createAction(CLOSE_WS_TO_GET_DATA);
export const setSelectedCar = createAction(SET_SELECTED_CAR);
export const setAllLastUpdate = createAction(SET_ALL_LAST_UPDATE);

export const updatePoints = createAction(UPDATE_POINTS,
  data => JSON.parse(data),
);

export function openWs(token) {
  return (dispatch, getState) => {
    const wsUrl = `${config.ws}?token=${token}`;
    const ws = new ReconnectingWebSocket(wsUrl, null);

    ws.onmessage = ({ data }) => {
      const {
        carsPoints: { selectedCarId },
        oneCarInfo: { max_speed },
      } = getState();
      const ans = JSON.parse(data);

      if (ans[selectedCarId]) {
        dispatch(addPointToTrack({ point: { ...ans[selectedCarId] }, max_speed }));
      }
      dispatch(updatePoints(data));

    };

    ws.onclose = (event) => {
      if (event.code === 1006) {
        Raven.captureException(new Error('1006: A connection was closed abnormally (that is, with no close frame being sent). A low level WebSocket error.'));
      }
      // console.warn('WEBSOCKET - Потеряно соединение с WebSocket, пытаемся переподключиться');
    };
    ws.onerror = () => {
      // console.error('WEBSOCKET - Ошибка WebSocket');
    };

    dispatch(setWs(ws));
  };
}

export const selectCar = id => (dispatch) => {
  dispatch(setSelectedCar(id));
};

const reducer = handleActions({
  [setWs]: handlePayload('ws'),
  [closeWs]: {
    next(state) {
      state.ws.close();

      return {
        ...initialState,
      };
    },
  },
  [updatePoints]: {
    next(state, { payload }) {
      const carsData = {
        ...state.carsData,
      };
      const byStatus = {
        ...state.byStatus,
      };
      const byConnectionStatus = {
        ...state.byConnectionStatus,
      };

      Object.entries(payload).forEach(([key, value]) => {
        const {
          connection_status,
          status,
          timestamp = 0,
        } = carsData[key] || {};

        const {
          connection_status: new_connection_status,
          status: new_status,
          timestamp: new_timestamp,
        } = value;

        if (timestamp > new_timestamp) {
          console.warn('got old info for point!');
        } else {
          if (status && connection_status) {
            byStatus[status] -= 1;
            byConnectionStatus[connection_status] -= 1;
          }

          byStatus[new_status] += 1;
          byConnectionStatus[new_connection_status] += 1;

          carsData[key] = {
            ...carsData[key],
            ...value,
          };
        }
      });

      return {
        ...state,
        byConnectionStatus,
        byStatus,
        carsData,
        lastUpdateCar: Object.keys(payload),
      };
    },
  },
  [setSelectedCar]: {
    next(state, { payload: selectedCarId = '' }) {
      const lastUpdateCar = [selectedCarId];

      let old_selectedCar = null;
      let new_selectedCar = null;

      const { selectedCarId: old_selectedCarId } = state;
      if (old_selectedCarId) {
        lastUpdateCar.push(old_selectedCarId);

        old_selectedCar = {
          [old_selectedCarId]: {
            ...state.carsData[old_selectedCarId],
            selected: false,
          },
        };
      }

      if (selectedCarId) {
        lastUpdateCar.push(selectedCarId);
        if (selectedCarId === '') {
          debugger;
        } 
        new_selectedCar = {
          [selectedCarId]: {
            ...state.carsData[selectedCarId],
            selected: true,
          },
        };
      }

      return {
        ...state,
        carsData: {
          ...state.carsData,
          ...old_selectedCar,
          ...new_selectedCar,
        },
        selectedCarId,
        lastUpdateCar,
      };
    },
  },
  [setAllLastUpdate]: state => ({
    ...state,
    lastUpdateCar: Object.keys(state.carsData),
  }),
}, initialState);

export default reducer;
