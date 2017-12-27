import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsRegulatedReportsNavItemNavItem extends IPropsNavbarItem {}

const RegulatedReportsNavItemNavItem: React.SFC<IPropsRegulatedReportsNavItemNavItem> = ({ path }) =>
  <NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
    <MenuItem active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
    <MenuItem active={path === '/fuel-consumption-summary-report'} href="#/fuel-consumption-summary-report">Сводный отчет расхода топлива</MenuItem>
  </NavDropdown>;

export default RegulatedReportsNavItemNavItem;
