import * as React from 'react';
import styled from 'styled-components';
import * as Label from 'react-bootstrap/lib/Label';

export const LabelStyled = styled(Label)``;

type EtsLabelProps = any;

const EtsLabel: React.FC<EtsLabelProps> = React.memo(
  (props) => {
    return (
      <LabelStyled {...props} />
    );
  },
);

export default EtsLabel;
