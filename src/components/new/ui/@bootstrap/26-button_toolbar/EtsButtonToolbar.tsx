import * as React from 'react';
import styled from 'styled-components';
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

export const ButtonToolbarStyled = styled(ButtonToolbar)``;

type EtsButtonToolbarProps = any;

const EtsButtonToolbar: React.FC<EtsButtonToolbarProps> = React.memo(
  (props) => {
    return (
      <ButtonToolbarStyled {...props} />
    );
  },
);

export default EtsButtonToolbar;
