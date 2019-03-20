import styled from 'styled-components';
import * as Col from 'react-bootstrap/lib/Col';
import * as BootstrapButton from 'react-bootstrap/lib/Button';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const Button = withRequirePermissionsNew({})(BootstrapButton);

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
