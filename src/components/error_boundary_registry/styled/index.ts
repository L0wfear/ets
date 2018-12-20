import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';

export const ErrorBoundaryRegistryContainer = styled(EtsPageWrap)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgba(255,0,0,0.2);
`;

export const ErrorCenter = styled.div`
  font-size: 40px;
`;
