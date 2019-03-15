import styled from 'styled-components';
import { borderRadiusButton } from './global-constants';
export type EtsPageWrapProps = {
  inheritDisplay?: boolean;
  autoHeight?: boolean;
};

export const DivNone = styled.div`
  display: none;
`;

export const DivGreen = styled.div`
  color: green;
`;

export const DivRed = styled.div`
  color: red;
`;

export const EtsPageWrap = styled.div<EtsPageWrapProps>`
  position: relative;
  height: 100%;

  padding: 15px;

  &:focus {
    outline: 0px !important;
    -webkit-appearance: none;
  }
  .datepicker-range {
    margin-bottom: 5px;
  }
`;

export const FlexContainer = styled.div<{ isWrap?: boolean }>`
  display: flex;
  flex-wrap: ${({ isWrap }) => (isWrap ? 'wrap' : 'initial')};
`;

export const Flex = styled.div<{
  grow?: number;
  shrink?: number;
  basis?: number;
  none?: boolean;
}>`
  flex: ${({ grow }) => grow || 0} ${({ shrink }) => shrink || 0}
    ${({ basis }) => basis || 0}px;
  display: ${({ none }) => (none ? 'none' : 'initial')};
`;

export const BorderDash = styled.div<{
  width?: number;
  borderStyle?: string;
  color?: string;
}>`
  border: ${(props) => {
    const { width = 1, borderStyle = 'solid', color = 'black' } = props;
    return `${width}px ${borderStyle} ${color}`;
  }};
`;

export const BtnPart = styled.div`
`;

export const BtnGroupWrapper = styled.div<{
  fullWidth?: boolean;
  vertical?: boolean;
}>`
  display: flex;
  align-items: center;
  ${BtnPart} button{
    border-radius: 0px!important;
  }
  ${BtnPart}:first-child button{
    border-radius: ${borderRadiusButton} 0px 0px ${borderRadiusButton}!important;
    margin-right: 0px!important;
  }
  ${BtnPart}:last-child button{
    border-radius: 0px ${borderRadiusButton} ${borderRadiusButton} 0px!important;
    margin-left: 0px!important;
  }
  ${({fullWidth}) => {
    if (fullWidth) {
      return `
        width: 100%;
        ${BtnPart}{
          flex: 1 1 auto;
          button{
            width: 100%;
          }
        }
      `;
    }
  }}
  ${({vertical}) => {
    if (vertical) {
      return `
        flex-direction: column;
        ${BtnPart} {
          width: 100%;
          flex: 1 1 auto;
        }
        ${BtnPart}:first-child button{
          border-radius: ${borderRadiusButton} ${borderRadiusButton} 0px 0px!important;
          margin-bottom: 0px!important;
        }
        ${BtnPart}:last-child button{
          border-radius: 0px 0px ${borderRadiusButton} ${borderRadiusButton}!important;
          margin-bottom: 0px!important;
        }
      `;
    }
  }}
`;

export const DisplayFlexAlignCenter = styled.div`
  display: flex;
  align-items: center;
`;
