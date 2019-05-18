import styled from 'styled-components';
import EtsBootstrap from '../../@bootstrap';

export const ButtonTableInput = styled(EtsBootstrap.Button)<{ width: number }>`
  &&& {
    width: ${({ width }) => width ? `${width}px` : 'initial'};
  }
`;
