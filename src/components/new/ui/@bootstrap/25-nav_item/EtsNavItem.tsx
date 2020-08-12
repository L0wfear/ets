import * as React from 'react';
import styled from 'styled-components';
import * as NavItem from 'react-bootstrap/lib/NavItem';
import { UiConstants } from '../../../../@next/@ui/renderFields/UiConstants';

export const NavItemStyled = styled(NavItem)<{tabHasErrors?: boolean;}>`
  &&&>a {
    color: ${ ({ tabHasErrors }) => tabHasErrors ? UiConstants.colorError : 'none' }!important;
  }
`;

export type EtsNavItemProps = any;

const EtsNavItem: React.FC<EtsNavItemProps> = React.memo(
  (props) => {
    return (
      <NavItemStyled {...props} />
    );
  },
);

export default EtsNavItem;
