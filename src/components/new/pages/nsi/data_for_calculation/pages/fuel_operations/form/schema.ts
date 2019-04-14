import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { PropsFuelOperations } from './@types/FuelOperationsForm';

export const fuelOperationsFormSchema: SchemaType<FuelOperationActive, PropsFuelOperations> = {
  properties: {
    name: {
      title: 'Операция',
      type: 'string',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'number',
      required: true,
      integer: true,
    },
  },
};
