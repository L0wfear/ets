import * as React from 'react';
import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const ButtonStyled = styled(EtsBootstrap.Button)``;

type EtsButtonProps = any;

const EtsButton: React.FC<EtsButtonProps> = React.memo(
  (props) => (
    <ButtonStyled {...props} />
  ),
);

export default EtsButton;
