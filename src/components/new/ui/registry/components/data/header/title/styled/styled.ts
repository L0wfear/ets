import styled from 'styled-components';
import { FlexContainer } from 'global-styled/global-styled';
import { mobiSize } from 'global-styled/global-constants';

export const EtsHeaderTitle = styled.div`
  font-size: 18px;
  margin: 2.5px;
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  justify-content: space-between;
  max-width: 100%;

  >* {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  align-items: baseline;
  margin-top: 4px;
  >* {
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const FlexContainerWrap = styled(FlexContainer)`
  align-items: flex-start;

    @media screen and (max-width: ${mobiSize}px) {
      align-items: center;
    }
`;
