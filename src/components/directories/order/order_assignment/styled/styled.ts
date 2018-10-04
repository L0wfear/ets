import styled from 'styled-components';
import { Col, Button as BootstrapButton } from 'react-bootstrap';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

const Button = enhanceWithPermissions({})(BootstrapButton);

export const ColOrderAssignmentHeaderTitleContainer = styled(Col)`
  display: flex;
  justify-content: space-between;
`;

export const TitleText = styled.h4`
  margin-left: 20px;
  font-weight: bold;
`;

export const ButtonOrderAssignment = styled(Button)`
  margin-left: 10px;
`;
