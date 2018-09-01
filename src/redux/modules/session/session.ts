import { createPath } from 'redux/redux-utils';

const SESSION = createPath('SESSION');

export const SESSION_SET_DATA = SESSION`SET_DATA`;
export const SESSION_RESET_DATA = SESSION`RESET_DATA`;

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

const initialState = {
  userData: {
    map_config: {
      zoom: MAP_INITIAL_ZOOM,
      coordinates: MAP_INITIAL_CENTER,
    },
    permissions: [],
  },
  token: null,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SESSION_SET_DATA: {
      return {
        userData: {
          ...payload.userData,
          map_config: {
            ...initialState.userData.map_config,
            ...payload.userData.map_config,
          },
        },
        token: payload.token,
      };
    }
    case SESSION_RESET_DATA: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}