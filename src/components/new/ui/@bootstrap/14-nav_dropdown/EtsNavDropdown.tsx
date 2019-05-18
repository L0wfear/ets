import * as React from 'react';
import styled from 'styled-components';
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown';

export const NavDropdownStyled = styled(NavDropdown)``;

type EtsNavDropdownProps = any;

const EtsNavDropdown: React.FC<EtsNavDropdownProps> = React.memo(
  (props) => {
    return (
      <NavDropdownStyled {...props} />
    );
  },
);

export default EtsNavDropdown;
