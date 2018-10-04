import {
  FaxogrammService,
} from 'api/Services';

export const saveFaxogramm = (id, payload = {}) => (
  FaxogrammService.path(id).getBlob(payload)
);