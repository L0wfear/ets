import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
// import PERMISSIONS from 'constants/permissions';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsStandardInfoNavItem extends IPropsNavbarItem {}

const StandardInfoNavItem: React.SFC<IPropsStandardInfoNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={['material_consumption_rate.list', 'fuel_consumption_rate.list', 'maintenance_rate.list']} title="Нормативные показатели" id="nav-dropdown-2-2">
    <MenuItem permissions={['material_consumption_rate.list']} active={path === '/material-consumption-rate'} href="#/material-consumption-rate">Нормы на расход расходных материалов</MenuItem>
    <MenuItem permissions={['fuel_consumption_rate.list']} active={path === '/fuel-rates'} href="#/fuel-rates">Нормы расхода топлива</MenuItem>
    <MenuItem permissions={['maintenance_rate.list']} active={path === '/maintenance-rate'} href="#/maintenance-rate">Нормы на содержание объектов</MenuItem>
  </NavDropdown>;

export default StandardInfoNavItem;
