import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const InstectionBlockSelect = styled(EtsBootstrap.Row)<{ disabled?: boolean }>`
  margin-top: 10px;
  margin-bottom: 10px;

  padding: 0;

  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export const SelectLabel = styled(EtsBootstrap.Col)`
  min-width: 100px;
`;

export const SelectField = styled(EtsBootstrap.Col)`
`;
