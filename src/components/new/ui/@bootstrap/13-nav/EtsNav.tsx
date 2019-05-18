import * as React from 'react';
import styled from 'styled-components';
import * as Nav from 'react-bootstrap/lib/Nav';

export const NavStyled = styled(Nav)``;

export type EtsNavProps = any;

const EtsNav: React.FC<EtsNavProps> = React.memo(
  (props) => {
    return (
      <NavStyled {...props} />
    );
  },
);

export default EtsNav;
