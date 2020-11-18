import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import cleaningRatePermissions from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/permissions';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { promiseSubmitCleaningRate } from 'redux-main/reducers/modules/cleaning_rate/promise_cleaning_rate';

export const metaCleaningRate: ConfigFormData<CleaningRate> = {
  uniqField: 'id',
  bsSizeForm: 'small',
  permissions: cleaningRatePermissions,
  handleSubmitPromise: promiseSubmitCleaningRate,
  schema: {
    header: {
      title: {
        create: 'Добавление показателя для расчета',
        update: 'Изменение показателя для расчета',
      },
    },
    body: {
      validate_fields: {
        technical_operation_id: {
          title: 'Технологическая операция',
          type: 'valueOfArray',
          required: true,
        },
        measure_unit_id: {
          title: 'Единица измерения',
          type: 'valueOfArray',
          required: true,
        },
        property: {
          title: 'Площадная характеристика',
          type: 'string',
          required: true,
        },
        value: {
          title: 'Коэффициент',
          type: 'number',
          float: 3,
          required: true,
        },
      },
    },
  },
  getDefaultElement: (reduxState) => ({
    company_id: null,
    company_name: null,
    id: null,
    measure_unit_id: null,
    measure_unit_name: '',
    okrug_name: null,
    property: '',
    property_text: '',
    technical_operation_id: null,
    technical_operation_name: '',
    type: 'odh',
    value: null,
  }),
};
