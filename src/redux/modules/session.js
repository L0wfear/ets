import { actionsFactory, handleActions, handlePayload } from 'redux/utils/actions';

const PATH = 'ets/session';
const createAction = actionsFactory(PATH);

const SET_PERMISSIONS = 'setPermissions';

const initialState = {
  permissions: [],
};

export const setPermissions = createAction(SET_PERMISSIONS);

const reducer = handleActions({
  [setPermissions]: handlePayload('permissions'),
}, initialState);

export default reducer;
