import { TypesService } from 'api/Services';
import { handleActions } from 'redux-actions';
import keyBy from 'lodash/keyBy';

const GET = 'ets/types/GET';

const initialState = {
  typesList: [],
  typesIndex: {},
};

export default handleActions({
  [GET]: {
    next(state, { payload }) {
      const { result } = payload;
      const { rows } = result;
      return {
        ...state,
        typesList: rows,
        typesIndex: keyBy(rows, 'id'),
      };
    },
    throw() {

    },
  },
}, initialState);

export function getTypes() {
  return {
    type: GET,
    payload: TypesService.get(),
    meta: {
      loading: true,
    },
  };
}
