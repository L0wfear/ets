import { createPath } from 'redux-main/redux-utils';
import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { Reducer } from 'redux';

const INSPECT_AUTOBASE_PATH = createPath('INSPECT_AUTOBASE_PATH');

export const INSPECT_AUTOBASE = {
  SET_DATA: INSPECT_AUTOBASE_PATH`SET_DATA`,
};

export const initialStateInspectAutobase: IStateInspectAutobase = {
  companyList: [],
  carpoolList: [],
  inspectAutobaseList: [],
  lastConductingInspect: null,
  lastCompletedInspect: null,
};

const inspectAutobase: Reducer<IStateInspectAutobase> = (state = initialStateInspectAutobase, { type, payload }) => {
  switch (type) {
    case INSPECT_AUTOBASE.SET_DATA: {
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

export default inspectAutobase;
