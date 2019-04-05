import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { mobiSize } from 'global-styled/global-constants';

export const ButtonPaginatorWrap = styled(Button)`
  @media screen and (max-width: ${mobiSize}px) {
    display: block;
    width: 100%;
  }
`;
