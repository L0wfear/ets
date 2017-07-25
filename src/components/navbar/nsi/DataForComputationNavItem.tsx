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

interface IPropsDataForComputationNavItem extends IPropsNavbarItem {}

const DataForComputationNavItem: React.SFC<IPropsDataForComputationNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={['cleaning_rate.list', 'odh_norm.list', 'maintenance_work.list', 'fuel_operation.list', 'odh_norm_data_summer.list', 'efficiency.list']} title="Показатели для расчета" id="nav-dropdown-2-4">
    <MenuItem permissions={['cleaning_rate.list']} active={path === '/cleaning-rate'} href="#/cleaning-rate">Показатели для расчета эффективности работы бригад</MenuItem>
    <MenuItem permissions={['odh_norm.list']} active={path === '/odh-norm'} href="#/odh-norm">Расходные материалы</MenuItem>
    <MenuItem permissions={['maintenance_work.list']} active={path === '/maintenance-work'} href="#/maintenance-work">Показатели регламентных работ</MenuItem>
    <MenuItem permissions={['fuel_operation.list']} active={path === '/fuel-operations'} href="#/fuel-operations">Операции для расчета топлива</MenuItem>
    <MenuItem permissions={['odh_norm_data_summer.list']} active={path === '/odh-norm-data-summer'} href="#/odh-norm-data-summer">Показатели норм по содержанию ОДХ (лето)</MenuItem>
    <MenuItem permissions={['efficiency.list']} active={path === '/efficiency'} href="#/efficiency">Показатели для расчета эффективности</MenuItem>
  </NavDropdown>;

export default DataForComputationNavItem;
