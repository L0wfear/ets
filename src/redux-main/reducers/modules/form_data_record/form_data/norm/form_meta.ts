import normRegistryPermissions from 'components/new/pages/nsi/norm_registry/_config-data/permissions';
import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { promiseSubmitNorm } from 'redux-main/reducers/modules/some_uniq/norm_registry/promise';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

export const metaNorm: ConfigFormData<Norm> = {
  uniqField: 'id',
  bsSizeForm: 'large',
  permissions: normRegistryPermissions,
  handleSubmitPromise: promiseSubmitNorm,
  schema: {
    header: {
      title: {
        create: 'Тех. операция',
        update: 'Тех. операция',
      },
    },
    body: {
      validate_fields: {
        sensor_type_ids: {
          type: 'multiValueOfArray',
          title: 'Типы навесного оборудования',
        },
      },
    },
  },
  getDefaultElement: (reduxState) => ({
    asuods_id: null,
    car_func_types: [],
    car_func_types_ids: [],
    car_func_types_text: '',
    check_type_names: '',
    check_types: [],
    conditions: '',
    consumable_materials_names: [],
    elements: [],
    elements_ids: [],
    elements_names: '',
    elements_text: '',
    id: null,
    is_cleaning_norm: false,
    kind_task_ids: [],
    kind_task_names: [],
    kind_task_names_text: '',
    max_speed: null,
    max_speed_text: '',
    name: '',
    norm: null,
    norm_registry_id: null,
    norm_id: null,
    norm_period: null,
    normatives: [],
    objects: [],
    objects_ids: [],
    objects_names: [],
    objects_text_array: [],
    objects_text: '',
    period_interval_name: null,
    route_types: [],
    season_id: null,
    season_name: '',
    sensor_type_ids: null,
    sensor_types: [],
    sensor_types_text: '',
    technical_operation_id: null,
    type_oper_id: null,
    use_in_report: false,
    work_class_id: null,
    work_type_id: null,
    work_type_name: '',
    type_oper_name: '',
  }),
};
