import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import userActionLogPermissions from './permissions';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { ORDER_STATUS_LABELS } from 'constants/dictionary';

export const orderRegistryKey = 'order';

export const getToConfig = (): TypeConfigData<Order> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'order',
        typeAns: 'result',
        payload: {
        },
        userServerFilters: true,
      },
    },
    registryKey: orderRegistryKey,
    header: {
      title: 'Реестр централизованных заданий (факсограмм)',
      format: 'datetime_range_picker',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.order_create_mission_by_templates,
        buttonsTypes.order_create_duty_mission_by_templates,
        buttonsTypes.order_export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'order_number',
          title: 'Номер',
          type: 'advanced-string-like',
        },
        {
          valueKey: 'create_date',
          title: 'Дата создания',
          type: 'advanced-date',
        },
        {
          valueKey: 'order_type_id',
          labelKey: 'order_type_name',
          title: 'Тип',
          type: 'multiselect',
        },
        {
          valueKey: 'status',
          title: 'Статус',
          type: 'multiselect',
          options: Object.entries(ORDER_STATUS_LABELS).map(
            ([value, label]) => ({ value, label }),
          ),
        },
      ],
    },
    list: {
      permissions: userActionLogPermissions,
      data: {
        uniqKey: 'id',
        uniqKeyForParams: `${orderRegistryKey}_id`,
        fixedWidth: true,
      },
      meta: {
        selected_row_in_params: true,
        fields: [
          {
            key: 'order_number',
            title: 'Номер',
            width: 150,
          },
          {
            key: 'create_date',
            title: 'Дата создания',
            format: 'datetime',
            dashIfEmpty: true,
            width: 200,
          },
          {
            key: 'order_date',
            title: 'Начало действия',
            format: 'datetime',
            dashIfEmpty: true,
            width: 200,
          },
          {
            key: 'order_date_to',
            title: 'Окончание действия',
            format: 'datetime',
            dashIfEmpty: true,
            width: 200,
          },
          {
            key: 'order_type_name',
            title: 'Тип',
            width: 200,
          },
          {
            key: 'status_name',
            title: 'Статус',
            width: 200,
          },
        ],
      },
      processed: {
        sort: {
          field: 'create_date',
          reverse: true,
        },
      },
    },
  };
};
