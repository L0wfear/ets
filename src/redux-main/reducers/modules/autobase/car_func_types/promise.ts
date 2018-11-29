import {
  autobaseLoadCarFuncTypess,
  autobaseCreateCarFuncTypes,
  autobaseUpdateCarFuncTypes,
} from 'redux-main/reducers/modules/autobase/promises';

export const getCarFuncTypess = autobaseLoadCarFuncTypess;
export const createCarFuncTypes = autobaseCreateCarFuncTypes;
export const updateCarFuncTypes = autobaseUpdateCarFuncTypes;

export const createSetCarFuncTypes = (oldCarFuncTypes) => {
  const payload = {
    ...oldCarFuncTypes,
  };

  return autobaseCreateCarFuncTypes(
    payload,
  );
};

export const updateSetCarFuncTypes = (oldCarFuncTypes) => {
  const payload = {
    ...oldCarFuncTypes,
  };

  return autobaseUpdateCarFuncTypes(
    payload,
  );
};
