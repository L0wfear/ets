import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from './@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsMissionNavItem extends IPropsNavbarItem {}

const MissionNavItem: React.SFC<IPropsMissionNavItem> = ({ isOkrug, path }) =>
  <NavDropdown hidden={isOkrug} oneOfPermissions={PERMISSIONS.missions.list} title="Задания" id="nav-dropdown-1">
    <MenuItem permissions={['mission.list']} active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
    <MenuItem permissions={['mission_template.list']} active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
    <MenuItem permissions={['duty_mission.list']} active={path === '/duty-missions-journal'} href="#/duty-missions-journal">Журнал наряд-заданий</MenuItem>
    <MenuItem permissions={['duty_mission_template.list']} active={path === '/duty-mission-templates-journal'} href="#/duty-mission-templates-journal">Шаблоны наряд-заданий</MenuItem>
  </NavDropdown>;

export default MissionNavItem;
