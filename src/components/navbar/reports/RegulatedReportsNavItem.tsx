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
/*
const RegulatedReportsNavItemNavItem: React.SFC<IPropsRegulatedReportsNavItemNavItem> = ({ path }) =>
  <NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
    <MenuItem active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
    <MenuItem active={path === '/fuel-consumption-summary-report'} href="#/fuel-consumption-summary-report">Сводный отчет расхода топлива</MenuItem>
    <MenuItem active={path === '/daily-cleaning-reports-ets'} href="#/daily-cleaning-reports-ets">Статус по уборке</MenuItem>
    <MenuItem active={path === '/daily-cleaning-reports-cafap'} href="#/daily-cleaning-reports-cafap">Статус по уборке (ЦАФАП)</MenuItem>
    <MenuItem active={path === '/cleaning-status-tech-op-report'} href="#/cleaning-status-tech-op-report">Статус по выполнению городских заданий</MenuItem>
  </NavDropdown>;
  */

const RegulatedReportsNavItemNavItem: React.SFC<IPropsRegulatedReportsNavItemNavItem> = ({ path }) =>
<NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
  <MenuItem active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
</NavDropdown>;

export default RegulatedReportsNavItemNavItem;
