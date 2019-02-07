import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';
import * as Button from 'react-bootstrap/lib/Button';

export const ErrorBoundaryRegistryContainer = styled(EtsPageWrap)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const ErorText = styled.div<{ font_size: number }>`
  font-size: ${({ font_size }) => font_size}px;
`;

export const ErorTextTimeOut = styled(ErorText)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const ButtonRefreshRegistry = styled(Button)`
  &&& {
    font-size: 20px;
    margin: 0 10px;
  }
`;
