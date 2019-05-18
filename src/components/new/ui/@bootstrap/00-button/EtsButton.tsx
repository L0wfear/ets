import * as React from 'react';
import styled from 'styled-components';
import * as Button from 'react-bootstrap/lib/Button';

export const ButtonStyled = styled(Button)``;

export type EtsButtonProps = any;

const EtsButton: React.FC<EtsButtonProps> = React.memo(
  (props) => (
    <ButtonStyled {...props} />
  ),
);

export default EtsButton;
