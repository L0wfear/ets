import { TypesService } from 'api/Services';
import { handleActions } from 'redux-actions';

export const actions = {
  GET: 'ets/types/GET'
}
const GET = 'ets/types/GET';

const initialState = {
  typesList: []
};

export default handleActions({
  [actions.GET]: {
    next(state, { payload }) {
      return {
        ...state,
        typesList: payload
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
