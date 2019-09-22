import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import fuelOperationsPermissions from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { promiseSubmitFuelOperation } from 'redux-main/reducers/modules/fuel_operations/promise_fuel_operation';

export const metaFuelOperations: ConfigFormData<FuelOperationActive> = {
  uniqField: 'id',
  bsSizeForm: 'small',
  permissions: fuelOperationsPermissions,
  handleSubmitPromise: promiseSubmitFuelOperation,
  schema: {
    header: {
      title: {
        create: 'Добавление операции для расчета топлива',
        update: 'Изменение операции для расчета топлива',
      },
    },
    body: {
      validate_fields: {
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
    },
  },
  getDefaultElement: (reduxState) => ({
    equipment: false,
    id: null,
    is_excluding_mileage: false,
    measure_unit_id: null,
    measure_unit_name: '',
    name: '',
  }),
};
