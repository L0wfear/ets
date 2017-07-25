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

const oneOfPermissions = [
  'type.list',
  'car.list',
  'autobase_battery.list',
  'autobase_battery_brand.list',
  'autobase_battery_manufacturer',
  'autobase_spare_part.list',
  'autobase_tire.list',
  'autobase_tech_maintenance_order.list',
];

interface IPropsVehicleNavItem extends IPropsNavbarItem {}

const VehicleNavItem: React.SFC<IPropsVehicleNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={oneOfPermissions} title="Транспортные средства" id="nav-dropdown-2-1">
    <MenuItem permissions={['type.list']} active={path === '/car-func-types'} href="#/car-func-types">Типы техники</MenuItem>
    <MenuItem permissions={['car.list']} active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
    <MenuItem permissions={['autobase_battery.list']} active={path === '/battery-registry'} href="#/battery-registry">Реестр аккумуляторов</MenuItem>
    <MenuItem permissions={['autobase_battery_brand.list']} active={path === '/battery-brand'} href="#/battery-brand">Марки аккумуляторов</MenuItem>
    <MenuItem permissions={['autobase_battery_manufacturer.list']} active={path === '/battery-manufacturer'} href="#/battery-manufacturer">Производители аккумуляторов</MenuItem>
    <MenuItem permissions={['autobase_tire.list']} active={path === '/tire'} href="#/tire">Реестр шин</MenuItem>
    <MenuItem permissions={['autobase_spare_part.list']} active={path === '/spare-part'} href="#/spare-part">Реестр запчастей</MenuItem>
    <MenuItem permissions={['autobase_tech_maintenance_order.list']} active={path === '/tech-maintenance-order-registry'} href="#/tech-maintenance-order-registry">Реестр регламентов ТО</MenuItem>
    <MenuItem permissions={['autobase_tech_inspection.list']} active={path === '/tech-inspection'} href="#/tech-inspection">Техосмотр</MenuItem>
  </NavDropdown>;

export default VehicleNavItem;
