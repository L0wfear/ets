import styled from 'styled-components';
import { constantColor } from 'global-styled/global-constants';
import { darken } from 'polished';

import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { getColorTd } from 'components/new/ui/@bootstrap/grid_bootstrap/tbody/utils';
import { ErrorField } from 'components/@next/@ui/renderFields/ErrorsBlock/styled/ErrorField';

export const EtsTrTbody = styled.tr<{ enable?: boolean, isSelected?: boolean, rowData?: any, checkData?: any, registryKey: string, borderedTd?: boolean, }>`
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
      color: ${({ isSelected }) => isSelected ? 'white' : 'initial'};
      background-color: ${({ isSelected }) => isSelected ? constantColor.colorGreen : 'initial'};
      border: ${ ({ borderedTd }) => borderedTd ? '1px solid #c1c1c1' : 'none' }
    }

    a {
      color: ${({isSelected}) => isSelected ? 'white' : '#0081d6'};
      text-decoration: ${({isSelected}) => isSelected ? 'underline' : 'underline'};
    }

    ${ErrorField}.error { /* inputTable error */
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
