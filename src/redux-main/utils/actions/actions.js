import {
  createAction as baseCreateAction,
} from 'redux-actions';

export const createAction = baseCreateAction;

export const actionsFactory = (path = '') =>
  (actionType, payloadCreator, metaCreator = (...args) => ({ args })) =>
  baseCreateAction(path + actionType, payloadCreator, metaCreator);
