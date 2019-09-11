import styled from 'styled-components';

export const RowStyled = styled.div<EtsRowProps>`
  margin-right: ${({ margin }) => `-${margin || 15}px`};
  margin-left: ${({ margin }) => `-${margin || 15}px`};

  &::before {
    display: table;
    content: " ";
  }
  &::after {
    clear: both;
    display: table;
    content: " ";
  }
`;

export type EtsRowProps = {
  id?: string;
  margin?: number;

  className?: string;
};

const EtsRow = RowStyled;

export default EtsRow;
