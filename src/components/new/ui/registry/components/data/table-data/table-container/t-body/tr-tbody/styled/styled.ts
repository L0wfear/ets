import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';
import { get } from 'lodash';
import { darken } from 'polished';
import { WAYBILL_STATUSES_KEY } from 'constants/statuses';
// import { FileInputWrapper } from 'components/old/ui/input/FileInput/styled';

import { isBoolean } from 'util';

import { registryWaybillKey } from 'components/new/pages/waybill/_config-data/registry-config';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { ORDER_STATUS_KEYS, ORDER_ASSIGNMENTS_STATUS_KEYS } from 'constants/dictionary';
import { orderTechnicaOperationRegistryKey } from 'components/new/pages/nsi/order/order_technical_operation/_config-data/registry-config';

const getColorTd = (rowData, checkData, registryKey) => {
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

export const EtsTrTbody = styled.tr<{ enable?: boolean, selected?: boolean, rowData?: any, checkData?: any, registryKey: string, borderedTd?: boolean, }>`
  &&& {
    cursor: ${({ enable }) => enable ? 'pointer' : 'default'};
    pointer-events: ${({ enable }) => enable ? 'all' : 'none'};

    &:nth-of-type(odd) {
      background-color: ${(props) => getColorTd(props.rowData, props.checkData, props.registryKey)};
    }
    &:nth-of-type(even) {
      background-color: ${(props) => darken(0.03, getColorTd(props.rowData, props.checkData, props.registryKey))};
    }
    transition: color 0.1s, background-color 0.1s;

    &:hover {
      &:nth-of-type(odd) {
        background-color: ${(props) => darken(0.08, getColorTd(props.rowData, props.checkData, props.registryKey))};
      }
      &:nth-of-type(even) {
        background-color: ${(props) => darken(0.08, getColorTd(props.rowData, props.checkData, props.registryKey))};
      }
      background-color: ${constantColor.colorLightGreen};

      a {
        &:hover {
          text-decoration: none;
        }
      }
    }

    td {
      transition: color 0.1s, background-color 0.1s;
      color: ${({ selected }) => selected ? 'white' : 'initial'};
      background-color: ${({ selected }) => selected ? constantColor.colorGreen : 'initial'};
      border: ${ ({ borderedTd }) => borderedTd ? '1px solid #c1c1c1' : 'none' }
    }

    a {
      color: ${({selected}) => selected ? 'white' : '#0081d6'};
      text-decoration: ${({selected}) => selected ? 'underline' : 'underline'};
    }
    .error { /* inputTable error */
      margin-top: 0px;
      border-radius: 0 0 3px 3px;
      margin-top: 0px;
      padding: 2px 5px;
      border-radius: 0 0 3px 3px;
      background: ${UiConstants.colorError};
      color: white;
      padding-left: 5px;
    }
    .form-group{
      margin-bottom: 0px;
    }
  }
`;
