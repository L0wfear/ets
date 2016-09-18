import { TypesService } from 'api/Services';
import { handleActions } from 'redux-actions';
import keyBy from 'lodash/keyBy';

const GET = 'ets/types/GET';

const initialState = {
  typesList: [],
  typesIndex: {}
};

export default handleActions({
  [GET]: {
    next(state, { payload }) {
      return {
        ...state,
        typesList: payload,
        typesIndex: keyBy(payload, 'id')
      }
    },
    throw(state, data) {

    }
  }
}, initialState)

export function getTypes() {
  return {
    type: GET,
    payload: TypesService.get(),
    meta: {
      loading: true
    }
  }
}
