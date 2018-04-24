import * as React from 'react';
import {
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';

import { IPropsNavbarItem } from 'components/navbar/@types/common.h';

import enhanceWithPermissions from 'components/util/RequirePermissions';
import PERMISSIONS from 'constants/permissions';

export const GORMOST_GEOOBJECTS_LIST_PERMISSIONS = [
  'bridges.list',
  'pedestrian_tunnels.list',
  'pedestrian_tunnel_exits.list',
  'fountains.list',
];

const GEOOBJECTS_ONEOF_PERMISSIONS = [
  'odh.list',
  'dt.list',
  'ssp.list',
  'msp.list',
  'fueling_water.list',
  'carpool.list',
  'danger_zone.list',
  'pgm.list',
  'snow_storage.list',
  ...GORMOST_GEOOBJECTS_LIST_PERMISSIONS,
];

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

const NsiNavItem: React.SFC<IPropsNavbarItem> = ({ path }) =>
  <NavDropdown id="show-nsi" oneOfPermissions={PERMISSIONS.nsi.list} title="НСИ">
    <MenuItem id="link-employees" permissions={['employee.list']} active={path === '/employees'} href="#/employees">Реестр сотрудников</MenuItem>
    <MenuItem id="link-faxogramms" permissions={['faxogramm.list']} active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>
    <MenuItem id="link-technical-operations" permissions={['technical_operation.list']} active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
    <MenuItem id="link-companies" permissions={['company.list']} active={path === '/companies'} href="#/companies">Реестр организаций</MenuItem>
    <MenuItem divider />

    <NavDropdown
      id="show-autobase"
      oneOfPermissions={[
        'type.list',
        'car.list',
        'autobase_battery.list',
        'autobase_battery_brand.list',
        'autobase_battery_manufacturer',
        'autobase_spare_part.list',
        'autobase_tire.list',
        'autobase_tire_model.list',
        'autobase_tech_maintenance_order.list',
        'autobase_tech_inspection.list',
        'autobase_insurance_policy.list',
        'autobase_company.list',
        // 'autobase_tech_maintenance.list',
      ]}
      title="Транспортные средства"
    >
      <MenuItem id="link-car-func-types" role="MENU_ROLE" permissions={['type.list']} active={path === '/car-func-types'} href="#/car-func-types">Типы техники</MenuItem>
      <MenuItem id="link-cars" permissions={['car.list']} active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
      <MenuItem id="link-battery-registry" permissions={['autobase_battery.list']} active={path === '/battery-registry'} href="#/battery-registry">Реестр аккумуляторов</MenuItem>
      <MenuItem id="link-battery-brand" permissions={['autobase_battery_brand.list']} active={path === '/battery-brand'} href="#/battery-brand">Марки аккумуляторов</MenuItem>
      <MenuItem id="link-battery-manufacturer" permissions={['autobase_battery_manufacturer.list']} active={path === '/battery-manufacturer'} href="#/battery-manufacturer">Производители аккумуляторов</MenuItem>
      <MenuItem id="link-tire" permissions={['autobase_tire.list']} active={path === '/tire'} href="#/tire">Реестр шин</MenuItem>
      <MenuItem id="link-tire-model" permissions={['autobase_tire_model.list']} active={path === '/tire-model'} href="#/tire-model">Марки шин</MenuItem>
      <MenuItem id="link-spare-part" permissions={['autobase_spare_part.list']} active={path === '/spare-part'} href="#/spare-part">Реестр запчастей</MenuItem>
      <MenuItem id="link-tech-maintenance-order-registry" permissions={['autobase_tech_maintenance_order.list']} active={path === '/tech-maintenance-order-registry'} href="#/tech-maintenance-order-registry">Реестр регламентов ТО</MenuItem>
      {/* <MenuItem id="link-" permissions={['autobase_tech_maintenance.list']} active={path === '/tech-maintenance-registry'} href="#/tech-maintenance-registry">Тех. обслуживание</MenuItem> */}
      <MenuItem id="link-tech-inspection" permissions={['autobase_tech_inspection.list']} active={path === '/tech-inspection'} href="#/tech-inspection">Реестр техосмотров</MenuItem>
      <MenuItem id="link-insurance-policyn" permissions={['autobase_insurance_policy.list']} active={path === '/insurance-policyn'} href="#/insurance-policy">Реестр страховок</MenuItem>
      <MenuItem id="link-repair-company" permissions={['autobase_company.list']} active={path === '/repair-company'} href="#/repair-company">Реестр ремонтных организаций</MenuItem>
    </NavDropdown>

    <NavDropdown
      id="show-repair"
      oneOfPermissions={[
        'repair_contractor.list',
        'repair_state_program.list',
        'ets_object_properties.list',
      ]}
      title="Планирование работ по техническому содержанию объектов"
    >
      <MenuItem id="link-contractor" permissions={['repair_contractor.list']} active={path === '/contractor'} href="#/contractor">Справочник Подрядчиков</MenuItem>
      <MenuItem id="link-state-program" permissions={['repair_state_program.list']} active={path === '/state-program'} href="#/state-program">Справочник государственных программ ремонта</MenuItem>
      <MenuItem id="link-object-property" permissions={['ets_object_properties.list']} active={path === '/object-property'} href="#/object-property">Справочник характеристик объектов</MenuItem>
    </NavDropdown>

    <NavDropdown id="show-fuel" oneOfPermissions={['material_consumption_rate.list', 'fuel_consumption_rate.list', 'maintenance_rate.list']} title="Нормативные показатели" >
      <MenuItem id="link-material-consumption-rate" permissions={['material_consumption_rate.list']} active={path === '/material-consumption-rate'} href="#/material-consumption-rate">Нормы на расход расходных материалов</MenuItem>
      <MenuItem id="link-fuel-rates" permissions={['fuel_consumption_rate.list']} active={path === '/fuel-rates'} href="#/fuel-rates">Нормы расхода топлива</MenuItem>
      <MenuItem id="link-maintenance-rate" permissions={['maintenance_rate.list']} active={path === '/maintenance-rate'} href="#/maintenance-rate">Нормы на содержание объектов</MenuItem>
    </NavDropdown>

    <NavDropdown id="show-directory" oneOfPermissions={GEOOBJECTS_ONEOF_PERMISSIONS} title="Геообъекты" >
      <MenuItem id="link-odh" permissions={['odh.list']} active={path === '/odh'} href="#/odh">Справочник ОДХ</MenuItem>
      <MenuItem id="link-dt" permissions={['dt.list']} active={path === '/dt'} href="#/dt">Справочник ДТ</MenuItem>
      <MenuItem id="link-ssp" permissions={['ssp.list']} active={path === '/ssp'} href="#/ssp">Справочник ССП</MenuItem>
      <MenuItem id="link-msp" permissions={['msp.list']} active={path === '/msp'} href="#/msp">Справочник МСП</MenuItem>
      <MenuItem id="link-fueling-water" permissions={['fueling_water.list']} active={path === '/fueling-water'} href="#/fueling-water">Справочник баз гидрантов</MenuItem>
      <MenuItem id="link-carpool" permissions={['carpool.list']} active={path === '/carpool'} href="#/carpool">Справочник Автобаз</MenuItem>
      <MenuItem id="link-danger-zones" permissions={['danger_zone.list']} active={path === '/danger-zones'} href="#/danger-zones">Справочник особо опасных мест</MenuItem>
      <MenuItem id="link-pgm" permissions={['pgm.list']} active={path === '/pgm'} href="#/pgm">Справочник пунктов отпуска ПГМ</MenuItem>
      <MenuItem id="link-snow-storage" permissions={['snow_storage.list']} active={path === '/snow-storage'} href="#/snow-storage">Справочник пунктов временного складирования снега</MenuItem>
      <MenuItem id="link-bridges" permissions={['bridges.list']} active={path === '/bridges'} href="#/bridges">Справочник мостов</MenuItem>
      <MenuItem id="link-pedestrian-tunnels" permissions={['pedestrian_tunnels.list']} active={path === '/pedestrian-tunnels'} href="#/pedestrian-tunnels">Пешеходные тоннели</MenuItem>
      <MenuItem id="link-pedestrian-tunnel-exits" permissions={['pedestrian_tunnel_exits.list']} active={path === '/pedestrian-tunnel-exits'} href="#/pedestrian-tunnel-exits">Выходы из пешеходных тоннелей</MenuItem>
      <MenuItem id="link-fountains" permissions={['fountains.list']} active={path === '/fountains'} href="#/fountains">Фонтаны</MenuItem>
    </NavDropdown>

    <NavDropdown id="show-other" oneOfPermissions={['cleaning_rate.list', 'odh_norm.list', 'maintenance_work.list', 'fuel_operation.list', 'odh_norm_data_summer.list', 'efficiency.list']} title="Показатели для расчета" >
      <MenuItem id="link-cleaning-rate" permissions={['cleaning_rate.list']} active={path === '/cleaning-rate'} href="#/cleaning-rate">Показатели для расчета эффективности работы бригад</MenuItem>
      <MenuItem id="link-odh-norm" permissions={['odh_norm.list']} active={path === '/odh-norm'} href="#/odh-norm">Расходные материалы</MenuItem>
      <MenuItem id="link-maintenance-work" permissions={['maintenance_work.list']} active={path === '/maintenance-work'} href="#/maintenance-work">Показатели регламентных работ</MenuItem>
      <MenuItem id="link-fuel-operations" permissions={['fuel_operation.list']} active={path === '/fuel-operations'} href="#/fuel-operations">Операции для расчета топлива</MenuItem>
      <MenuItem id="link-odh-norm-data-summer" permissions={['odh_norm_data_summer.list']} active={path === '/odh-norm-data-summer'} href="#/odh-norm-data-summer">Показатели норм по содержанию ОДХ (лето)</MenuItem>
      <MenuItem id="link-efficiency" permissions={['efficiency.list']} active={path === '/efficiency'} href="#/efficiency">Показатели для расчета эффективности</MenuItem>
    </NavDropdown>

    <MenuItem id="link-medical-stats" permissions={['medical_stats.list']} active={path === '/medical-stats'} href="#/medical-stats">Статистика прохождения мед. осмотров</MenuItem>
    <MenuItem permissions={['medical_stats.list']} divider />
    <MenuItem id="link-user-action-log" permissions={['user_action_log.list']} active={path === '/user-action-log'} href="#/user-action-log">Журнал действий пользователя</MenuItem>
  </NavDropdown>;

export default NsiNavItem;
