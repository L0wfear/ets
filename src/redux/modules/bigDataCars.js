import { actionsFactory, handleActions } from 'redux/utils/actions';
import { keyBy } from 'lodash';

import {
  CarService,
  ModelsService,
  TypesService,
} from 'api/Services';

const PATH = 'ets/bigDataCars';
const createAction = actionsFactory(PATH);

const SET_CARS_DATA = 'setCarsData';
const SET_CARS_MODEL = 'setCarsModels';
const SET_CARS_TYPES = 'setCarsTypes';

const initialState = {
  carslist: [],
  carsIndex: [],
  modelsList: [],
  typesList: [],
};

export const setCarsData = createAction(SET_CARS_DATA);
export const setCarsModels = createAction(SET_CARS_MODEL);
export const setCarsTypes = createAction(SET_CARS_TYPES);

export const loadCars = () => (dispatch) => {
  const payload = {};

  return CarService.get(payload).then(({ result: { rows: cars } }) => dispatch(setCarsData(cars)));
};

export const loadModel = () => (dispatch) =>
  ModelsService.get().then(({ result: { rows: models = [] } = {} }) => dispatch(setCarsModels(models)));


export const loadTypes = () => (dispatch) =>
  TypesService.get().then(({ result: { rows = [] } = {} }) => dispatch(setCarsTypes(rows)));

const reducer = handleActions({
  [setCarsData]: {
    next(state, { payload: cars }) {
      const carsList = cars.map(c => ({
        ...c,
      }));

      return {
        ...state,
        carsList,
        carsIndex: keyBy(carsList, 'asuods_id'),
      };
    },
  },
  [setCarsModels]: {
    next(state, { payload: modelsList }) {
      return {
        ...state,
        modelsList,
        modelsIndex: keyBy(modelsList, 'id'),
      };
    },
  },
  [setCarsTypes]: {
    next(state, { payload: typesList }) {
      return {
        ...state,
        typesList,
        typesIndex: keyBy(typesList, 'asuods_id'),
      };
    },
  },
}, initialState);

export default reducer;
