import {
  TechnicalOperationRegistryService,
  TechnicalOperationObjectsService,
} from 'api/Services';

export const loadTechnicalOperations = (outerPayload) => {
  const payload = {
    ...outerPayload,
  };

  return TechnicalOperationRegistryService
    .get(payload)
    .then(({ result: { rows } }) => ({
      technical_operations_list: rows,
    }))
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        technical_operations_list: [],
      };
    });
};

export const loadTechnicalOperationsObjects: any = () => (
  TechnicalOperationObjectsService.get()
    .then(({ result: { rows } }) => ({
      technical_operations_object_list: rows,
    }))
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        technical_operations_object_list: [],
      };
    })
);
