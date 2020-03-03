import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import userActionLogPermissions from 'components/new/pages/nsi/order/_config-data/permissions';
import { Order } from 'redux-main/reducers/modules/order/@types';

export const orderTechnicaOperationRegistryKey = 'order_technical_operation';

export const getToConfig = (array: Order['technical_operations'], instruction: Order['instruction']): TypeConfigData<ValuesOf<Order['technical_operations']>> => {
  return {
    noInitialLoad: true,
    Service: {},
    registryKey: orderTechnicaOperationRegistryKey,
    header: {
      title: 'Расшифровка централизованного задания',
      format: 'order_to',
      buttons: [
        buttonsTypes.order_to_create_mission,
        buttonsTypes.order_to_create_duty_mission,
      ],
    },
    list: {
      permissions: userActionLogPermissions,
      data: {
        array,
        objectExtra: {
          array: [
            {
              instruction,
            },
          ],
        },
        uniqKey: 'order_operation_id',
        uniqKeyForParams: 'order_operation_id',
        fixedWidth: true,
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'tk_operation_name',
            title: 'Операция',
            width: 200,
          },
          {
            key: 'object_type_name',
            title: 'Тип объекта',
            width: 125,
          },
          {
            key: 'elem',
            title: 'Элемент',
            width: 200,
          },
          {
            key: 'num_exec',
            title: 'Количество выполнений',
            width: 150,
          },
          {
            key: 'date_from',
            title: 'Начало действия',
            format: 'datetime',
            width: 150,
          },
          {
            key: 'date_to',
            title: 'Окончание действия',
            format: 'datetime',
            width: 175,
          },
          {
            key: 'work_type_name',
            title: 'Способ выполнения операции',
            width: 175,
          },
        ],
      },
    },
  };
};
