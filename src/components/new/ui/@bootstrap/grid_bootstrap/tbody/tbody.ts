import styled from 'styled-components';
import { CommonDisplayContent, CommonTdTh } from 'components/new/ui/@bootstrap/grid_bootstrap/common';
import { darken } from 'polished';
import { getColorTd } from 'components/new/ui/@bootstrap/grid_bootstrap/tbody/utils';
import { constantColor } from 'global-styled/global-constants';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const EtsTbody = styled.div`
  ${CommonDisplayContent};
`;

const EtsTbodyTd = styled.div`
  ${CommonTdTh};
  transition: color 0.1s, background-color 0.1s;
  word-break: break-word;
`;

const EtsBodyTr = styled.div<{ enable?: boolean; isSelected?: boolean; rowData?: any; checkData?: Record<string, any>; registryKey?: string;}>`
  ${CommonDisplayContent};

  cursor: ${({ enable }) => enable ? 'pointer' : 'default'};
  pointer-events: ${({ enable }) => enable ? 'all' : 'none'};

  :nth-of-type(odd) {
    ${EtsTbodyTd} {
      background-color: ${(props) => (
    props.isSelected
      ? constantColor.colorGreen
      : getColorTd(props.rowData, props.checkData, props.registryKey)
  )};
    }
  }
  :nth-of-type(even) {
    ${EtsTbodyTd} {
      background-color: ${(props) => (
    props.isSelected
      ? constantColor.colorGreen
      : darken(0.03, getColorTd(props.rowData, props.checkData, props.registryKey))
  )};
    }
  }

  :hover {
    ${EtsTbodyTd} {
      background-color: ${(props) => (
    props.isSelected
      ? constantColor.colorGreen
      : darken(0.08, getColorTd(props.rowData, props.checkData, props.registryKey))
  )};

      a {
        :hover {
          text-decoration: none;
        }
      }
    }
  }
  :last-child ${EtsTbodyTd}  {
    border-bottom: 1px solid #c1c1c1;
  }
  ${EtsTbodyTd} {
    color: ${({ isSelected }) => isSelected ? 'white' : 'initial'};
    :first-child {
      border-left: 1px solid #c1c1c1;
    }
    :last-child {
      border-right: 1px solid #c1c1c1;
    }
    background-color: ${({ isSelected }) => isSelected ? constantColor.colorGreen : 'initial'};

    a {
      color: ${({isSelected}) => isSelected ? 'white' : '#0081d6'};
      text-decoration: ${({isSelected}) => isSelected ? 'underline' : 'underline'};
    }
    .error {                                  /* inputTable error */
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

const GridBootstrapTbody = {
  Tbody: EtsTbody,
  Tr: EtsBodyTr,
  Td: EtsTbodyTd,
};

export default GridBootstrapTbody;
