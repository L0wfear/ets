import styled from 'styled-components';
import { lighten } from 'polished';

export const SupportTextContainer = styled.a<{ color?: string; }>`
  color: ${({ color }) => color || 'white'};
  font-weight: bold;
  cursor: pointer;
  :hover {
    color: ${({ color }) => color ? lighten(0.04, color) : 'white'};
  }
`;

export const SupportContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 1 200px;

  align-items: center;
  white-space: nowrap;

  ${SupportTextContainer} {
    padding: 0 10px;
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
`;
