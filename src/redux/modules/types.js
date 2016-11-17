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
      return {
        ...state,
        typesList: result,
        typesIndex: keyBy(result, 'id'),
      };
    },
    throw() {

    },
  },
}, initialState);

export function getTypes() {
  return {
    type: GET,
    payload: TypesService.get().then(r => ({ result: r.result.rows })),
    meta: {
      loading: true,
    },
  };
}
