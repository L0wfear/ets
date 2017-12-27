import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsOperationalReportsNavItem extends IPropsNavbarItem {}

// return route
const OperationalReportsNavItem: React.SFC<IPropsOperationalReportsNavItem> = ({ path }) =>
  <NavDropdown title="Оперативные отчеты" id="nav-dropdown-3-1">
    <MenuItem active={path === '/route-odh-coverage-report'} href="#/route-odh-coverage-report">Покрытие ОДХ маршрутами</MenuItem>
    <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
    <MenuItem active={path === '/car-usage-report-with-track'} href="#/car-usage-report-with-track">Статистика выхода техники</MenuItem>
    <MenuItem active={path === '/track-events-reports'} href="#/track-events-reports">Отчет по возможным сливам топлива</MenuItem>
  </NavDropdown>;

export default OperationalReportsNavItem;
