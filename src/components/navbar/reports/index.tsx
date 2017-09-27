import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';
/* TODO не закрываются окна, после выбора в дочернем элементе
import OperationalReportsNavItem from './OperationalReportsNavItem';
import RegulatedReportsNavItem from './RegulatedReportsNavItem';
<OperationalReportsNavItem path={path} />
<RegulatedReportsNavItem path={path} />
*/
const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

interface IPropsReportsNavItem extends IPropsNavbarItem {}

const ReportsNavItem: React.SFC<IPropsReportsNavItem> = ({ path }) =>
  <NavDropdown oneOfPermissions={[PERMISSIONS.report.list]} title="Отчеты" id="nav-dropdown-3">
    <NavDropdown title="Оперативные отчеты" id="nav-dropdown-3-1">
      <MenuItem active={path === '/route-odh-coverage-report'} href="#/route-odh-coverage-report">Покрытие ОДХ маршрутами</MenuItem>
      <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
      <MenuItem active={path === '/car-usage-report-with-track'} href="#/car-usage-report-with-track">Статистика выхода техники</MenuItem>
      <MenuItem active={path === '/track-events-reports'} href="#/track-events-reports">Отчет по возможным сливам топлива</MenuItem>
      <MenuItem active={path === '/brigade-efficiency-report'} href="#/brigade-efficiency-report">Работа бригад по ручной уборке</MenuItem>
      <MenuItem active={path === '/employee-efficiency-report'} href="#/employee-efficiency-report">Работа сотрудников по ручной уборке</MenuItem>
      <MenuItem active={path === '/mission-progress-report'} href="#/mission-progress-report">Отчет по уборке территорий</MenuItem>
      <MenuItem active={path === '/long-repair'} href="#/long-repair">Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне</MenuItem>
      <MenuItem active={path === '/tech-maintenance-schedule'} href="#/tech-maintenance-schedule">График проведения технического обслуживания транспортных средств</MenuItem>
      <MenuItem active={path === '/inquiry-expiring-date'} href="#/inquiry-expiring-date">Перечень справок, по которым подходит дата окончания действия</MenuItem>
    </NavDropdown>
    <NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
      <MenuItem active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
      <MenuItem active={path === '/fuel-consumption-summary-report'} href="#/fuel-consumption-summary-report">Сводный отчет расхода топлива</MenuItem>
      <MenuItem active={path === '/daily-cleaning-reports-ets'} href="#/daily-cleaning-reports-ets">Статус по уборке</MenuItem>
      <MenuItem active={path === '/daily-cleaning-reports-cafap'} href="#/daily-cleaning-reports-cafap">Статус по уборке (ЦАФАП)</MenuItem>
      <MenuItem active={path === '/cleaning-status-tech-op-report'} href="#/cleaning-status-tech-op-report">Статус по выполнению городских заданий</MenuItem>
    </NavDropdown>
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
