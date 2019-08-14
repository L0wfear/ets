import * as React from 'react';
import styled from 'styled-components';
import * as Label from 'react-bootstrap/lib/Label';

export const LabelBackgroundStyled = styled(Label)`
  &&& {
    margin-left: 10px;
    padding: 5px;
  }
`;

export type EtsBackgroundLabelProps = any;

const EtsBackgroundLabel: React.FC<EtsBackgroundLabelProps> = React.memo(
  (props) => {
    return (
      <LabelBackgroundStyled {...props} />
    );
  },
);

export default EtsBackgroundLabel;
