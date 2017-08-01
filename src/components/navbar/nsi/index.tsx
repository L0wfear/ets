import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';

/* TODO не закрываются окна, после выбора в дочернем элементе
import VehiclesNavItem from './VehiclesNavItem';
import StandardInfoNavItem from './StandardInfoNavItem';
import GeoObjectsNavItem from './GeoObjectsNavItem';
import DataForComputationNavItem from './DataForComputationNavItem';

<VehiclesNavItem path={path} />
<StandardInfoNavItem path={path} />
<GeoObjectsNavItem path={path} />
<DataForComputationNavItem path={path} />
*/
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

    <NavDropdown oneOfPermissions={[
      'type.list',
      'car.list',
      'autobase_battery.list',
      'autobase_battery_brand.list',
      'autobase_battery_manufacturer',
      'autobase_spare_part.list',
      'autobase_tire.list',
      'autobase_tech_maintenance_order.list',
      // 'autobase_tech_maintenance_registry.list',
    ]} title="Транспортные средства" id="nav-dropdown-2-1">
      <MenuItem role="MENU_ROLE" permissions={['type.list']} active={path === '/car-func-types'} href="#/car-func-types">Типы техники</MenuItem>
      <MenuItem permissions={['car.list']} active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
      <MenuItem permissions={['autobase_battery.list']} active={path === '/battery-registry'} href="#/battery-registry">Реестр аккумуляторов</MenuItem>
      <MenuItem permissions={['autobase_battery_brand.list']} active={path === '/battery-brand'} href="#/battery-brand">Марки аккумуляторов</MenuItem>
      <MenuItem permissions={['autobase_battery_manufacturer.list']} active={path === '/battery-manufacturer'} href="#/battery-manufacturer">Производители аккумуляторов</MenuItem>
      <MenuItem permissions={['autobase_tire.list']} active={path === '/tire'} href="#/tire">Реестр шин</MenuItem>
      <MenuItem permissions={['autobase_spare_part.list']} active={path === '/spare-part'} href="#/spare-part">Реестр запчастей</MenuItem>
      <MenuItem permissions={['autobase_tech_maintenance_order.list']} active={path === '/tech-maintenance-order-registry'} href="#/tech-maintenance-order-registry">Реестр регламентов ТО</MenuItem>
      {/* <MenuItem permissions={['autobase_tech_maintenance_registry.list']} active={path === '/tech-maintenance-registry'} href="#/tech-maintenance-registry">Тех. обслуживание</MenuItem> */}
      <MenuItem permissions={['autobase_tech_inspection.list']} active={path === '/tech-inspection'} href="#/tech-inspection">Реестр техосмотров</MenuItem>
      <MenuItem permissions={['autobase_insurance_policy_registry.list']} active={path === '/insurance-policyn'} href="#/insurance-policy">Реестр страховок</MenuItem>
    </NavDropdown>

    <NavDropdown oneOfPermissions={['material_consumption_rate.list', 'fuel_consumption_rate.list', 'maintenance_rate.list']} title="Нормативные показатели" id="nav-dropdown-2-2">
      <MenuItem permissions={['material_consumption_rate.list']} active={path === '/material-consumption-rate'} href="#/material-consumption-rate">Нормы на расход расходных материалов</MenuItem>
      <MenuItem permissions={['fuel_consumption_rate.list']} active={path === '/fuel-rates'} href="#/fuel-rates">Нормы расхода топлива</MenuItem>
      <MenuItem permissions={['maintenance_rate.list']} active={path === '/maintenance-rate'} href="#/maintenance-rate">Нормы на содержание объектов</MenuItem>
    </NavDropdown>

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
    </NavDropdown>

    <NavDropdown oneOfPermissions={['cleaning_rate.list', 'odh_norm.list', 'maintenance_work.list', 'fuel_operation.list', 'odh_norm_data_summer.list', 'efficiency.list']} title="Показатели для расчета" id="nav-dropdown-2-4">
      <MenuItem permissions={['cleaning_rate.list']} active={path === '/cleaning-rate'} href="#/cleaning-rate">Показатели для расчета эффективности работы бригад</MenuItem>
      <MenuItem permissions={['odh_norm.list']} active={path === '/odh-norm'} href="#/odh-norm">Расходные материалы</MenuItem>
      <MenuItem permissions={['maintenance_work.list']} active={path === '/maintenance-work'} href="#/maintenance-work">Показатели регламентных работ</MenuItem>
      <MenuItem permissions={['fuel_operation.list']} active={path === '/fuel-operations'} href="#/fuel-operations">Операции для расчета топлива</MenuItem>
      <MenuItem permissions={['odh_norm_data_summer.list']} active={path === '/odh-norm-data-summer'} href="#/odh-norm-data-summer">Показатели норм по содержанию ОДХ (лето)</MenuItem>
      <MenuItem permissions={['efficiency.list']} active={path === '/efficiency'} href="#/efficiency">Показатели для расчета эффективности</MenuItem>
    </NavDropdown>

    <MenuItem permissions={['medical_stats.list']} active={path === '/medical-stats'} href="#/medical-stats">Статистика прохождения мед. осмотров</MenuItem>
    <MenuItem permissions={['medical_stats.list']} divider />
    <MenuItem permissions={['user_action_log.list']} active={path === '/user-action-log'} href="#/user-action-log">Журнал действий пользователя</MenuItem>
  </NavDropdown>;

export default NsiNavItem;

