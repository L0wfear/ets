import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import userActionLogPermissions from 'components/new/pages/nsi/order/_config-data/permissions';
import { OrderHistory } from 'redux-main/reducers/modules/order/@types';

export const orderHistroyRegistryKey = 'order_history';

export const getToConfig = (array: OrderHistory['technical_operations'], instruction: OrderHistory['order_info']): TypeConfigData<ValuesOf<OrderHistory['technical_operations']>> => {
  return {
    noInitialLoad: true,
    Service: {},
    registryKey: orderHistroyRegistryKey,
    header: {
      format: 'order_to',
    },
    list: {
      permissions: userActionLogPermissions,
      data: {
        uniqKey: 'order_operation_history_id',
        array,
        objectExtra: {
          array: [
            {
              instruction,
            },
          ],
        },
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
        ],
      },
    },
  };
};
