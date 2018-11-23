import {
  loadTechnicalOperations,
  loadTechnicalOperationsObjects
} from 'redux-main/trash-actions/technical-operation/promise/promise';

export const getTechnicalOperations: any = (type, outerPayload, meta) => ({
  type,
  payload: loadTechnicalOperations(outerPayload),
  meta,
});

export const getTechnicalOperationsObjects: any = (type, ownPayload, meta) => ({
  type,
  payload: loadTechnicalOperationsObjects(),
  meta: {
    promise: true,
    page: meta.page,
    path: meta.path,
  },
});
