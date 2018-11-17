import {
  OrderService,
} from 'api/Services';

export const saveOrder = (id, payload = {}) => (
  OrderService.path(id).getBlob(payload)
);
