import { createPath } from 'redux-main/redux-utils';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { Reducer } from 'redux';

const INSPECT_PGM_BASE_PATH = createPath('INSPECT_PGM_BASE_PATH');

export const INSPECT_PGM_BASE = {
  SET_DATA: INSPECT_PGM_BASE_PATH`SET_DATA`,
};

export const initialStateInspectPgmBase: IStateInspectPgmBase = {
  inspectPgmBaseList: [],
};

const inspectPgmBase: Reducer<IStateInspectPgmBase> = (state = initialStateInspectPgmBase, { type, payload }) => {
  switch (type) {
    case INSPECT_PGM_BASE.SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default inspectPgmBase;
