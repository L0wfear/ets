import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ButtonCheckPermission from 'components/ui/buttons/ButtonCheckPermission';

export const ColOrderAssignmentHeaderTitleContainer = styled(EtsBootstrap.Col)`
  display: flex;
  justify-content: space-between;
`;

export const TitleText = styled.h4`
  margin-left: 20px;
  font-weight: bold;
`;

export const ButtonOrderAssignment = styled(ButtonCheckPermission)`
  margin-left: 10px;
`;
