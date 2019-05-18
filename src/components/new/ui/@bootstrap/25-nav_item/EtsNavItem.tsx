import * as React from 'react';
import styled from 'styled-components';
import * as NavItem from 'react-bootstrap/lib/NavItem';

export const NavItemStyled = styled(NavItem)``;

type EtsNavItemProps = any;

const EtsNavItem: React.FC<EtsNavItemProps> = React.memo(
  (props) => {
    return (
      <NavItemStyled {...props} />
    );
  },
);

export default EtsNavItem;
