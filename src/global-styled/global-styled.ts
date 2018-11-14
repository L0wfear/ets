import styled from 'styled-components';

export type EtsPageWrapProps = {
  inheritDisplay ?: boolean;
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
  padding: 20px;
  display: ${({ inheritDisplay }) => inheritDisplay ? 'inherit': 'flex'};
  flex-direction: column;
  align-items: stretch;

  &:focus {
    outline:0px !important;
    -webkit-appearance:none;
  }
`;

export const FlexWrapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Flex = styled.div<{ grow?: number; shrink?: number; basis?: number, none?: boolean }>`
  flex: ${({ grow }) => grow | 0} ${({ shrink }) => shrink | 0} ${({ basis }) => basis | 0}px;
  display: ${({ none }) => none ? 'none': 'initial'};
`;
