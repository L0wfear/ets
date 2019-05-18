import * as React from 'react';
import styled from 'styled-components';
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton';

export const DropdownButtonStyled = styled(DropdownButton)``;

type EtsDropdownButtonProps = any;

const EtsDropdownButton: React.FC<EtsDropdownButtonProps> = React.memo(
  (props) => {
    return (
      <DropdownButtonStyled {...props} />
    );
  },
);

export default EtsDropdownButton;
