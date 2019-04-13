import { createPath } from 'redux-main/redux-utils';
import { IStateInspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { Reducer } from 'redux';

const INSPECT_CARS_CONDITION_PATH = createPath('INSPECT_CARS_CONDITION_PATH');

export const INSPECT_CARS_CONDITION = {
  SET_DATA: INSPECT_CARS_CONDITION_PATH`SET_DATA`,
};

export const initialStateInspectCarsCondition: IStateInspectCarsCondition = {
  companyList: [],
  inspectCarsConditionList: [],
  lastConductingInspect: null,
  lastCompletedInspect: null,
};

const inspectCarsCondition: Reducer<IStateInspectCarsCondition> = (state = initialStateInspectCarsCondition, { type, payload }) => {
  switch (type) {
    case INSPECT_CARS_CONDITION.SET_DATA: {
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

export default inspectCarsCondition;
