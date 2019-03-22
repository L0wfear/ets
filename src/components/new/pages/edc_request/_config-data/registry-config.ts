import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

export const registryKey = 'EdcRequest';

export const config: TypeConfigData<EdcRequest> = {
  Service: {
    getRegistryData: {
      entity: 'edc_layer_request',
      typeAns: 'result',
      userServerFilters: true,
    },
    getOneData: {
      entity: 'edc_layer_request',
      typeAns: 'result.0',
    },
  },
  registryKey,
  header: {
    title: 'Реестр заявок',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.createMissionByEdcReques,
      buttonsTypes.createDutyMissionByEdcReques,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'status_id',
        type: 'multiselect',
        title: 'Статус',
        disabled: true,
      },
      {
        valueKey: 'request_id',
        type: 'advanced-number',
        title: 'Заявка №',
      },
      {
        valueKey: 'create_date',
        type: 'advanced-date',
        title: 'Дата',
      },
      {
        valueKey: 'defect_category_id',
        type: 'multiselect',
        title: 'Категория',
        disabled: true,
      },
      {
        valueKey: 'defect_id',
        type: 'multiselect',
        title: 'Дефект',
        disabled: true,
      },
      {
        valueKey: 'emergency_id',
        type: 'multiselect',
        title: 'Срочность',
        disabled: true,
      },
      {
        valueKey: 'peredano_v_ppoz',
        type: 'advanced-date',
        title: 'Передано в ППОЗ',
      },
    ],
  },
  list: {
    permissions: edcRequestPermissions,
    data: {
      uniqKey: 'id',
    },
    meta: {
      fields: [
        {
          key: 'checkbox',
        },
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'status_name',
          title: 'Статус',
        },
        {
          key: 'request_number',
          title: 'Заявка №',
        },
        {
          key: 'create_date',
          title: 'Дата',
          format: 'datetime',
        },
        {
          key: 'defect_category_name',
          title: 'Категория',
        },
        {
          key: 'defect_name',
          title: 'Дефект',
        },
        {
          key: 'emergency_name',
          title: 'Срочность',
        },
        {
          key: 'mission_numbers_text',
          title: 'Задание №',
        },
        {
          key: 'duty_mission_numbers_text',
          title: 'Наряд-задание №',
        },
        {
          key: 'ods',
          title: 'ОДС',
        },
        {
          key: 'address_name',
          title: 'Адрес',
        },
        {
          key: 'district_name',
          title: 'Район',
        },
        {
          key: 'okrug_name',
          title: 'Округ',
        },
        {
          key: 'contractor_name',
          title: 'Организация',
        },
        {
          key: 'main_phone',
          title: 'Осн.телефон',
        },
        {
          key: 'additional_phone',
          title: 'Доп.телефон',
        },
        {
          key: 'name',
          title: 'Контактное лицо',
        },
        {
          key: 'desired_time_from',
          title: 'Желательное время с:',
          format: 'datetime',
        },
        {
          key: 'desired_time_to',
          title: 'Желательное время по:',
          format: 'datetime',
        },
        {
          key: 'desired_date',
          title: 'Желательная дата',
        },
        {
          key: 'peredano_v_ppoz',
          title: 'Передано в ППОЗ',
        },
      ],
    },
  },
};
