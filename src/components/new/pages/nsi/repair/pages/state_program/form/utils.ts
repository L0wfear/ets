import { isObject, isNullOrUndefined } from 'util';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';

export const defaultStateProgram: StateProgram = {
  id: null,
  name: '',
  status_id: null,
  status_name: '',
};

export const getDefaultStateProgramElement = (element: Partial<StateProgram>): StateProgram => {
  const newElement = { ...defaultStateProgram };
  if (isObject(element)) {
    Object.keys(defaultStateProgram).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultStateProgram[key];
    });
  }

  return newElement;
};
