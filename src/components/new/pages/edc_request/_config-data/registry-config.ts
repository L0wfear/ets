import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

export const registryKey = 'EdcRequest';

export const config: TypeConfigData<EdcRequest> = {
  Service: {
    getRegistryData: {
      entity: 'edc_request',
      typeAns: 'result',
      userServerFilters: true,
    },
    getOneData: {
      entity: 'edc_request',
      typeAns: 'result.0',
    },
  },
  registryKey,
  header: {
    title: 'Реестр заявок',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.edc_request_create_mission,
      buttonsTypes.edc_request_create_duty_mission,
      buttonsTypes.edc_request_close,
      buttonsTypes.edc_request_reject,
      buttonsTypes.edc_request_cancel,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'status_id',
        type: 'multiselect',
        title: 'Статус',
        getRegistryData: {
          entity: 'edc/status',
          valueKey: 'edc_id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'request_number',
        type: 'advanced-string-like',
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
        getRegistryData: {
          entity: 'edc/defect_category',
          valueKey: 'edc_id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'defect_id',
        type: 'multiselect',
        title: 'Дефект',
        getRegistryData: {
          entity: 'edc/defect',
          valueKey: 'edc_id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'emergency_id',
        type: 'multiselect',
        title: 'Срочность',
        getRegistryData: {
          entity: 'edc/emergency',
          valueKey: 'edc_id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'reason_name',
        type: 'multiselect',
        title: 'Причина отмены/отклонения',
      },
      {
        valueKey: 'request_send_at',
        type: 'advanced-date',
        title: 'Передано в ППОЗ',
      },
      {
        valueKey: 'rework',
        type: 'multiselect',
        title: 'Возвращена на доработку',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
      },
    ],
  },
  list: {
    permissions: edcRequestPermissions,
    data: {
      uniqKey: 'id',
      uniqKeyForParams: 'edc_request_id',
      fixedWidth: true,
    },
    meta: {
      row_double_click: true,
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'edc_request_info',
          title: 'Возврат',
          sortable: false,
          width: 100,
          displayIfPermission: [edcRequestPermissions.list, edcRequestPermissions.read],
        },
        {
          key: 'status_name',
          title: 'Статус',
          width: 100,
        },
        {
          key: 'request_number',
          title: 'Заявка №',
          width: 150,
        },
        {
          key: 'create_date',
          title: 'Дата',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'deffect_category_name',
          title: 'Категория',
          width: 200,
        },
        {
          key: 'defect_name',
          title: 'Дефект',
          width: 200,
        },
        {
          key: 'description',
          title: 'Описание проблемы',
          width: 400,
        },
        {
          key: 'show_file_list',
          title: 'Фото',
        },
        {
          key: 'show_edc_comments',
          title: 'Чат',
          displayIfPermission: [edcRequestPermissions.create],
        },
        {
          key: 'emergency_name',
          title: 'Срочность',
          width: 150,
        },
        {
          key: 'mission_numbers_text',
          title: 'Задание №',
          width: 150,
        },
        {
          key: 'duty_mission_numbers_text',
          title: 'Наряд-задание №',
          width: 200,
        },
        {
          key: 'ods',
          title: 'ОДС',
          width: 100,
        },
        {
          key: 'address_name',
          title: 'Адрес',
          width: 300,
        },
        {
          key: 'district_name',
          title: 'Район',
          width: 100,
        },
        {
          key: 'okrug_name',
          title: 'Округ',
          width: 100,
        },
        {
          key: 'contractor_name',
          title: 'Организация',
          width: 200,
        },
        {
          key: 'desired_time_from',
          title: 'Желательное время с',
          width: 200,
        },
        {
          key: 'desired_time_to',
          title: 'Желательное время по',
          width: 200,
        },
        {
          key: 'desired_date',
          title: 'Желательная дата',
          width: 200,
        },
        {
          key: 'reason_name',
          title: 'Причина отмены/отклонения',
          width: 200,
        },
        {
          key: 'request_send_at',
          title: 'Передано в ППОЗ',
          width: 200,
        },
      ],
    },
  },
};
