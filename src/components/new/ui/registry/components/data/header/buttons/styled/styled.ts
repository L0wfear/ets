import styled from 'styled-components';
import { mobiSize } from 'global-styled/global-constants';

export const EtsButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  >* {
    margin: 5px 5px 0px 5px;
  }

  @media screen and (max-width: ${mobiSize}px) {
    justify-content: center;
  }
`;
