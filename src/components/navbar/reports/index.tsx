import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';
import OperationalReportsNavItem from './OperationalReportsNavItem';
import RegulatedReportsNavItem from './RegulatedReportsNavItem';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsReportsNavItem extends IPropsNavbarItem {}

const ReportsNavItem: React.SFC<IPropsReportsNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={[PERMISSIONS.report.list]} title="Отчеты" id="nav-dropdown-3">
    <OperationalReportsNavItem path={path} />
    <RegulatedReportsNavItem path={path} />
    {
      // <NavDropdown title="Графические отчеты" id="nav-dropdown-3-3">
      //   <MenuItem active={path === '/coverage-report'} href="#/coverage-report">
      //     Графический отчет покрытия объектов городского хозяйства (ОДХ, ДТ)
      //   </MenuItem>
      // </NavDropdown>
    }
    <MenuItem active={path === '/analytics'} href="#/analytics">Аналитика</MenuItem>
  </NavDropdown>;

export default ReportsNavItem;
