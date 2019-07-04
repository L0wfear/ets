import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';
import { get } from 'lodash';
import { darken } from 'polished';
import { WAYBILL_STATUSES_KEY } from 'constants/statuses';
// import { FileInputWrapper } from 'components/ui/input/FileInput/styled';

import { isBoolean } from 'util';

import { registryWaybillKey } from 'components/new/pages/waybill/_config-data/registry-config';

const getColorTd = (rowData, checkData, registryKey) => {
  if (get(rowData, 'is_valid_to_order_operation', null) === false) {
    return constantColor.orange;
  }

  if (registryKey === registryWaybillKey && get(rowData, 'status', null) === WAYBILL_STATUSES_KEY.active) {
    return constantColor.colorChildRegistry;
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

export const EtsTrTbody = styled.tr<{ enable?: boolean, selected?: boolean, rowData?: any, checkData?: any, registryKey: string }>`
  &&& {
    cursor: ${({ enable }) => enable ? 'pointer' : 'default'};
    pointer-events: ${({ enable }) => enable ? 'all' : 'none'};

    &:nth-of-type(odd) {
      background-color: ${(props) => getColorTd(props.rowData, props.checkData, props.registryKey)};
    }
    &:nth-of-type(even) {
      background-color: ${(props) => darken(0.02, getColorTd(props.rowData, props.checkData, props.registryKey))};
    }

    &:hover {
      &:nth-of-type(odd) {
      background-color: ${constantColor.colorLightGreen};
      }
      &:nth-of-type(even) {
        background-color: ${darken(0.02, constantColor.colorLightGreen)};
      }
      background-color: ${constantColor.colorLightGreen};

      td {
        color: white;
      }
      a {
        color: white;
        &:hover {
          text-decoration: none;
        }
      }
    }

    td {
      color: ${({ selected }) => selected ? 'white' : 'initial'};
      background-color: ${({ selected }) => selected ? constantColor.colorGreen : 'initial'};
    }

    a {
      color: ${({selected}) => selected ? 'white' : '#0081d6'};
      text-decoration: ${({selected}) => selected ? 'underline' : 'underline'};
    }
  }
`;
