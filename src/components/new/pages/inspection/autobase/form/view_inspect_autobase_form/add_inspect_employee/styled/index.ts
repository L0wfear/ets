import styled from 'styled-components';
import {
  constantColor,
} from 'global-styled/global-constants';

export const ViewAddInspectEmployeeWrapper = styled.div`
`;

export const FieldWrap = styled.div`
`;

export const ShowBlockWrapper = styled.div`
  border: solid 3px ${constantColor.colorLightGray};
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 3px;
  margin: 10px 0px;
  display: block;
  position: relative;
  ${FieldWrap}{
    margin-bottom: 10px;
  }
  button.close {
    opacity: 1;
    color: ${constantColor.colorGray};
    position: absolute;
    top: 0px;
    right: 2px;
    left: unset;
    &:hover {
      color: black!important;
      background: transparent!important;
    }
  }
`;
