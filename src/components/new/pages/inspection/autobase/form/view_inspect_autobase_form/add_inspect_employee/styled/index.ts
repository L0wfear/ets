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
  background-color: ${constantColor.colorLightGray};
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
    top: 2px;
    right: 6px;
    left: unset;
    padding: 5px 10px;
    &:hover, &:focus {
      color: black!important;
      background: transparent!important;
    }
  }
`;

export const EmpInfo = styled.div`
  display: block;
  max-width: 350px;
`;

export const EmpRow = styled.div<{
  highlight?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  margin-bottom: 10px;
  ${
    ({highlight}) => {
      if ( highlight ) {
        return `
          &:hover {
            ${EmpInfo} {
              text-decoration: underline;
            }
          }
        `;
      }
    }
  }
  button.close {
    opacity: 1;
    color: ${constantColor.colorGray};
    padding: 5px 10px;
    &:hover, &:focus {
      color: black!important;
      background: transparent!important;
    }
  }
`;

export const ViewInspectSingleBlock = styled.div`
  margin-bottom: 20px;
`;
