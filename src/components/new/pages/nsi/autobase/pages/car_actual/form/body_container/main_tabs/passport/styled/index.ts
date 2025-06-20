import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const MarginTopRow = styled(EtsBootstrap.Row)`
  margin-top: 20px;
`;

export const FlexRow = styled(MarginTopRow)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row-reverse;
`;

export const CenterCol = styled(EtsBootstrap.Col)`
  text-align: center;
`;
