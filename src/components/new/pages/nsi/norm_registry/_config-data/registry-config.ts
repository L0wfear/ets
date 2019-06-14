import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/norm_registry/_config-data/permissions';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';

export const registryKey = 'normRegistry';

export const config: TypeConfigData<Norm> = {
  Service: {
    getRegistryData: {
      entity: 'cleaning/norm_registry',
      format: 'normRegistry',
    },
  },
  registryKey,
  header: {
    title: 'Реестр технологических операций',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'name',
        title: 'Наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'elements_names',
        title: 'Элемент',
        type: 'multiselect',
      },
      {
        valueKey: 'season_id',
        labelKey: 'season_name',
        title: 'Сезон',
        type: 'multiselect',
      },
      {
        valueKey: 'kind_task_names',
        title: 'Способ выполнения',
        type: 'multiselect',
      },
      {
        valueKey: 'work_type_id',
        labelKey: 'work_type_name',
        title: 'Способ уборки',
        type: 'multiselect',
      },
      {
        valueKey: 'conditions',
        title: 'Условия',
        type: 'multiselect',
      },
      {
        valueKey: 'norm_period',
        title: 'Число операций в сутки (норматив)',
        type: 'multiselect',
      },
      {
        valueKey: 'check_type_names',
        title: 'Тип проверки',
        type: 'multiselect',
      },
      {
        valueKey: 'objects_names',
        title: 'Объект',
        type: 'multiselect',
        getRegistryData: {
          entity: 'technical_operation_objects',
          valueKey: 'short_name', // id for server filter
          labelKey: 'short_name',
        },
      },
      {
        valueKey: 'car_func_types_ids',
        title: 'Типы ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: 'types',
          valueKey: 'asuods_id', // <<< asuods_id swap
          labelKey: 'short_name',
          mergeWithArray: true,
        },
      },
      {
        valueKey: 'sensor_type_ids',
        title: 'Типы навесного оборудования',
        type: 'multiselect',
        getRegistryData: {
          entity: 'sensor_type',
          valueKey: 'id',
          labelKey: 'name',
          mergeWithArray: true,
        },
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'norm_registry_id',
      fixedWidth: true,
      uniqKeyForParams: 'norm_registry_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'name',
          title: 'Наименование',
          width: 200,
        },
        {
          key: 'elements_names',
          title: 'Элемент',
          width: 200,
          format: 'array',
        },
        {
          key: 'season_name',
          title: 'Сезон',
          width: 100,
        },
        {
          key: 'kind_task_names_text',
          title: 'Способ выполнения',
          width: 200,
        },
        {
          key: 'work_type_name',
          title: 'Способ уборки',
          width: 200,
        },
        {
          key: 'conditions',
          title: 'Условия',
          width: 100,
        },
        {
          key: 'norm_period',
          title: 'Число операций в сутки (норматив)',
          width: 200,
        },
        {
          key: 'check_type_names',
          title: 'Тип проверки',
          width: 150,
        },
        {
          key: 'objects_text',
          title: 'Объект',
          width: 100,
        },
        {
          key: 'car_func_types_text',
          title: 'Типы ТС',
          width: 500,
        },
        {
          key: 'sensor_types_text',
          title: 'Типы навесного оборудования',
          width: 200,
        },
      ],
    },
  },
};
