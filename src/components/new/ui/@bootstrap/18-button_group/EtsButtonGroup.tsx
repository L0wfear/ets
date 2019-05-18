import * as React from 'react';
import styled from 'styled-components';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

export const ButtonGroupStyled = styled(ButtonGroup)``;

export type EtsButtonGroupProps = any;

const EtsButtonGroup: React.FC<EtsButtonGroupProps> = React.memo(
  (props) => {
    return (
      <ButtonGroupStyled {...props} />
    );
  },
);

export default EtsButtonGroup;
