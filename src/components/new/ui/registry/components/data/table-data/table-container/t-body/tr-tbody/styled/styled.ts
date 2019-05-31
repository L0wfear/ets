import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';
import { get } from 'lodash';
import { darken } from 'polished';
import { WAYBILL_STATUSES_KEY } from 'constants/statuses';
import { FileInputWrapper } from 'components/ui/input/FileInput/styled';
import { isBoolean } from 'util';

const getColorTd = (rowData) => {
  if (get(rowData, 'is_valid_to_order_operation', null) === false) {
    return constantColor.orange;
  }

  if (get(rowData, 'status', null) === WAYBILL_STATUSES_KEY.active) {
    return constantColor.colorChildRegistry;
  }

  if (!!get(rowData, 'parent_id', null)) {
    return constantColor.colorChildRegistry;
  }

  if (isBoolean(get(rowData, 'is_actual', null)) && !get(rowData, 'is_actual', null)) {
    return constantColor.redRegisry;
  }

  return 'white';
};

export const EtsTrTbody = styled.tr<{ enable?: boolean, selected?: boolean, rowData?: any }>`
  &&& {
    cursor: ${({ enable }) => enable ? 'pointer' : 'default'};
    pointer-events: ${({ enable }) => enable ? 'all' : 'none'};

    &:nth-of-type(odd) {
      background-color: ${(props) => getColorTd(props.rowData)};
    }
    &:nth-of-type(even) {
      background-color: ${(props) => darken(0.02, getColorTd(props.rowData))};
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
      ${FileInputWrapper} {
        a {
          color: white;
          &:hover {
            text-decoration: none;
          }
        }
      }
    }

    td {
      color: ${({ selected }) => selected ? 'white' : 'initial'};
      background-color: ${({ selected }) => selected ? constantColor.colorGreen : 'initial'};
    }

    ${FileInputWrapper} {
      a {
        color: ${({selected}) => selected ? 'white' : '#0081d6'};
        text-decoration: ${({selected}) => selected ? 'underline' : 'underline'};
      }
    }

  }
`;
