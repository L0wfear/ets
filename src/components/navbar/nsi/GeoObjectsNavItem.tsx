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

interface IPropsGeoObjectsNavItem extends IPropsNavbarItem {}

const GeoObjectsNavItem: React.SFC<IPropsGeoObjectsNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={['odh.list', 'dt.list', 'ssp.list', 'msp.list', 'fueling_water.list', 'carpool.list', 'danger_zone.list', 'pgm.list', 'snow_storage.list']} title="Геообъекты" id="nav-dropdown-2-3">
    <MenuItem permissions={['odh.list']} active={path === '/odh'} href="#/odh">Справочник ОДХ</MenuItem>
    <MenuItem permissions={['dt.list']} active={path === '/dt'} href="#/dt">Справочник ДТ</MenuItem>
    <MenuItem permissions={['ssp.list']} active={path === '/ssp'} href="#/ssp">Справочник ССП</MenuItem>
    <MenuItem permissions={['msp.list']} active={path === '/msp'} href="#/msp">Справочник МСП</MenuItem>
    <MenuItem permissions={['fueling_water.list']} active={path === '/fueling-water'} href="#/fueling-water">Справочник баз гидрантов</MenuItem>
    <MenuItem permissions={['carpool.list']} active={path === '/carpool'} href="#/carpool">Справочник Автобаз</MenuItem>
    <MenuItem permissions={['danger_zone.list']} active={path === '/danger-zones'} href="#/danger-zones">Справочник особо опасных мест</MenuItem>
    <MenuItem permissions={['pgm.list']} active={path === '/pgm'} href="#/pgm">Справочник пунктов отпуска ПГМ</MenuItem>
    <MenuItem permissions={['snow_storage.list']} active={path === '/snow-storage'} href="#/snow-storage">Справочник пунктов временного складирования снега</MenuItem>
  </NavDropdown>;

export default GeoObjectsNavItem;
