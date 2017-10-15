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
  <NavDropdown id="show-report" oneOfPermissions={[PERMISSIONS.reportAll.list]} title="Отчеты" >
    <NavDropdown id="show-operative" title="Оперативные отчеты" >
      <MenuItem id="link-route-odh-coverage-report" permissions={[PERMISSIONS.reportAll.route_odh_coverage_report.list]} active={path === '/route-odh-coverage-report'} href="#/route-odh-coverage-report">Покрытие ОДХ маршрутами</MenuItem>
      <MenuItem id="link-mission-reports" permissions={[PERMISSIONS.reportAll.car_travel_report.list]} active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
      <MenuItem id="link-car-usage-report" permissions={[PERMISSIONS.reportAll.car_usage_report_with_track_report.list]}  active={path === '/car-usage-report'} href="#/car-usage-report">Статистика выхода техники</MenuItem>
      <MenuItem id="link-track-events-reports" permissions={[PERMISSIONS.reportAll.track_events_report.list]} active={path === '/track-events-reports'} href="#/track-events-reports">Отчет по возможным сливам топлива</MenuItem>
      <MenuItem id="link-brigade-efficiency-report" permissions={[PERMISSIONS.reportAll.brigade_efficiency_report.list]} active={path === '/brigade-efficiency-report'} href="#/brigade-efficiency-report">Работа бригад по ручной уборке</MenuItem>
      <MenuItem id="link-employee-efficiency-report" permissions={[PERMISSIONS.reportAll.employee_efficiency_report.list]} active={path === '/employee-efficiency-report'} href="#/employee-efficiency-report">Работа сотрудников по ручной уборке</MenuItem>
      <MenuItem id="link-mission-progress-report" permissions={[PERMISSIONS.reportAll.mission_progress_report.list]} active={path === '/mission-progress-report'} href="#/mission-progress-report">Отчет по уборке территорий</MenuItem>
      <MenuItem id="link-long-repair" permissions={[PERMISSIONS.reportAll.autobase_long_repair_report.list]} active={path === '/long-repair'} href="#/long-repair">Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне</MenuItem>
      <MenuItem id="link-tech-maintenance-schedule" permissions={[PERMISSIONS.reportAll.autobase_tech_maintenance_schedule_report.list]} active={path === '/tech-maintenance-schedule'} href="#/tech-maintenance-schedule">График проведения технического обслуживания транспортных средств</MenuItem>
      <MenuItem id="link-inquiry-expiring-date" permissions={[PERMISSIONS.reportAll.autobase_inquiry_expiring_date_report.list]} active={path === '/inquiry-expiring-date'} href="#/inquiry-expiring-date">Перечень справок, по которым подходит дата окончания действия</MenuItem>
    </NavDropdown>
    {/*
    <NavDropdown id="show-reglament" title="Регламентированные отчеты" >
      <MenuItem id="link-fuel-consumption-report" permissions={[PERMISSIONS.reportAll.fuel_consumption_report.list]} active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
      <MenuItem id="link-fuel-consumption-summary-report" permissions={[PERMISSIONS.reportAll.fuel_consumption_summary_report.list]} active={path === '/fuel-consumption-summary-report'} href="#/fuel-consumption-summary-report">Сводный отчет расхода топлива</MenuItem>
      <MenuItem id="link-daily-cleaning-reports-ets" permissions={[PERMISSIONS.reportAll.cleaning_status_report.list]} active={path === '/daily-cleaning-reports-ets'} href="#/daily-cleaning-reports-ets">Статус по уборке</MenuItem>
      <MenuItem id="link-daily-cleaning-reports-cafap" permissions={[PERMISSIONS.reportAll.cleaning_status_cafap_report.list]} active={path === '/daily-cleaning-reports-cafap'} href="#/daily-cleaning-reports-cafap">Статус по уборке (ЦАФАП)</MenuItem>
      <MenuItem id="link-cleaning-status-tech-op-report" permissions={[PERMISSIONS.reportAll.cleaning_status_tech_op_report.list]} active={path === '/cleaning-status-tech-op-report'} href="#/cleaning-status-tech-op-report">Статус по выполнению городских заданий</MenuItem>
    </NavDropdown>
    */}
    <NavDropdown id="show-reglament" title="Регламентированные отчеты" >
      <MenuItem id="link-fuel-consumption-report" active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
    </NavDropdown>
    {
      // <NavDropdown title="Графические отчеты" id="nav-dropdown-3-3">
      //   <MenuItem id="link-" active={path === '/coverage-report'} href="#/coverage-report">
      //     Графический отчет покрытия объектов городского хозяйства (ОДХ, ДТ)
      //   </MenuItem>
      // </NavDropdown>
    }
    <MenuItem id="link-analytics" permissions={[PERMISSIONS.reportAll.analytical_reports.list]} active={path === '/analytics'} href="#/analytics">Аналитика</MenuItem>
  </NavDropdown>;

export default ReportsNavItem;
