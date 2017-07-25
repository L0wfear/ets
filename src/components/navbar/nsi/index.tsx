import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';
import VehiclesNavItem from './VehiclesNavItem';
import StandardInfoNavItem from './StandardInfoNavItem';
import GeoObjectsNavItem from './GeoObjectsNavItem';
import DataForComputationNavItem from './DataForComputationNavItem';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsNsiNavItem extends IPropsNavbarItem {}

const NsiNavItem: React.SFC<IPropsNsiNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={PERMISSIONS.nsi.list} title="НСИ" id="nav-dropdown-2">
    <MenuItem permissions={['employee.list']} active={path === '/employees'} href="#/employees">Реестр сотрудников</MenuItem>
    <MenuItem permissions={['faxogramm.list']} active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>
    <MenuItem permissions={['technical_operation.list']} active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
    <MenuItem permissions={['company.list']} active={path === '/companies'} href="#/companies">Реестр организаций</MenuItem>
    <MenuItem divider />

    <VehiclesNavItem path={path} />
    <StandardInfoNavItem path={path} />
    <GeoObjectsNavItem path={path} />
    <DataForComputationNavItem path={path} />

    <MenuItem permissions={['medical_stats.list']} active={path === '/medical-stats'} href="#/medical-stats">Статистика прохождения мед. осмотров</MenuItem>
    <MenuItem permissions={['medical_stats.list']} divider />
    <MenuItem permissions={['user_action_log.list']} active={path === '/user-action-log'} href="#/user-action-log">Журнал действий пользователя</MenuItem>
  </NavDropdown>;

export default NsiNavItem;
