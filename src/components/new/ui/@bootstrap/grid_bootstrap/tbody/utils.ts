import { get } from 'lodash';
import { constantColor } from 'global-styled/global-constants';
import { WAYBILL_STATUSES_KEY } from 'constants/statuses';

import { isBoolean } from 'util';

import { registryWaybillKey } from 'components/new/pages/waybill/_config-data/registry-config';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { ORDER_STATUS_KEYS, ORDER_ASSIGNMENTS_STATUS_KEYS } from 'constants/dictionary';
import { orderTechnicaOperationRegistryKey } from 'components/new/pages/nsi/order/order_technical_operation/_config-data/registry-config';

export const getColorTd = <F extends any>(rowData: F, checkData: Record<string, F>, registryKey: string) => {
  if (get(rowData, 'is_valid_to_order_operation', null) === false) {
    return constantColor.orange;
  }

  if (registryKey === registryWaybillKey && get(rowData, 'status', null) === WAYBILL_STATUSES_KEY.active) {
    return constantColor.colorChildRegistry;
  }

  if (registryKey === orderRegistryKey) {
    const status = get(rowData, 'status');
    if (status === ORDER_STATUS_KEYS.cancelled || status === ORDER_STATUS_KEYS.suspended) {
      return constantColor.simpleRed;
    }
    if (status === ORDER_STATUS_KEYS.partially_cancelled || status === ORDER_STATUS_KEYS.partially_suspended) {
      return constantColor.simpleYellow;
    }
  }

  if (registryKey === orderTechnicaOperationRegistryKey) {
    const change_status = get(rowData, 'change_status');
    if (change_status === ORDER_ASSIGNMENTS_STATUS_KEYS.full) {
      return constantColor.simpleRed;
    }
    if (change_status === ORDER_ASSIGNMENTS_STATUS_KEYS.partial) {
      return constantColor.simpleYellow;
    }
  }

  if (get(checkData, 'front_invalid_interval', null)) {
    return constantColor.simpleRed;
  }

  if (!!get(rowData, 'parent_id', null)) {
    return constantColor.colorChildRegistry;
  }

  if (isBoolean(get(rowData, 'is_actual', null)) && !get(rowData, 'is_actual', null)) {
    return constantColor.redRegisry;
  }

  return 'white';
};
