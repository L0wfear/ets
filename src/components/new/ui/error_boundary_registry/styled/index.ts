import styled from 'styled-components';
import { EtsPageWrap } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const cat = require('assets/images/cat.jpeg');

export const ErrorBoundaryRegistryContainer = styled(EtsPageWrap)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const ErorText = styled.div<{ font_size: number; }>`
  font-size: ${({ font_size }) => font_size}px;
  text-align: center;
`;

export const ErorTextTimeOut = styled(ErorText)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  flex-wrap: wrap;
`;

export const ButtonRefreshRegistry = styled(EtsBootstrap.Button)`
  &&& {
    font-size: 20px;
    margin: 0 10px;
  }
`;

export const DivCat = styled.img.attrs({
  src: cat,
  role: 'presentation',
})`
  width: 300px;
  height: 300px;
`;

export const TextRefreshRegistry = styled.div`
  margin: 10px;
`;
