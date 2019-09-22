import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import cleaningRatePermissions from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { promiseSubmitCleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/promise_cleaning_area_rate';

export const metaCleaningAreaRate: ConfigFormData<CleaningAreaRate> = {
  uniqField: 'id',
  bsSizeForm: 'small',
  permissions: cleaningRatePermissions,
  handleSubmitPromise: promiseSubmitCleaningAreaRate,
  schema: {
    header: {
      title: {
        create: 'Коэффициенты площади уборки',
        update: 'Коэффициенты площади уборки',
      },
    },
    body: {
      validate_fields: {
        technical_operation_id: {
          title: 'Технологическая операция',
          type: 'valueOfArray',
          required: true,
        },
        municipal_facility_id: {
          title: 'Элемент',
          type: 'valueOfArray',
          required: true,
        },
        clean_category_id: {
          title: 'Категория ОДХ',
          type: 'valueOfArray',
          required: true,
        },
        clean_subcategory_id: {
          title: 'Подкатегория ОДХ',
          type: 'valueOfArray',
        },
        value: {
          title: 'Коэффициент площади уборки',
          type: 'number',
          float: 3,
          required: true,
          min: 0,
          max: 1,
        },
      },
    },
  },
  getDefaultElement: (reduxState) => ({
    municipal_facility_id: null,
    clean_subcategory_id: null,
    technical_operation_id: null,
    municipal_facility_name: '',
    id: null,
    value: null,
    clean_category_id: null,
    clean_category_name: '',
    technical_operation_name: '',
    clean_subcategory_name: '',
  }),
};
