import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Navbar, Nav, Glyphicon,
  NavItem as BootstrapNavItem,
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';
import { autobind } from 'core-decorators';
import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import { FluxContext, HistoryContext } from 'utils/decorators';
import PERMISSIONS from 'constants/permissions';
import enhanceWithPermissions from './util/RequirePermissions.jsx';
import defaultUser from '../assets/images/avatar-default.png';

let VERSION_DESCRIPTION;
try {
  const VERSION = process.env.VERSION;
  VERSION_DESCRIPTION = `Версия ${VERSION}`;
} catch (e) {
  VERSION_DESCRIPTION = '';
}

const ROLES = {
  master: 'Мастер',
  dispatcher: 'Диспетчер',
  prefect: 'Префект',
  superuser: 'Администратор',
};

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);
const NavItem = enhanceWithPermissions(BootstrapNavItem);
const NavDropdown = enhanceWithPermissions(BootstrapNavDropdown);

@FluxContext
@HistoryContext
export default class MainPage extends React.Component {

  static get propTypes() {
    return {
      location: PropTypes.object,
      children: PropTypes.node,
    };
  }

  constructor() {
    super();

    this.state = {
      user: {},
    };
  }

  componentWillMount() {
    this.setState({
      user: this.context.flux.getStore('session').getCurrentUser(),
    });
  }

  componentWillReceiveProps() {
    this.setState({
      user: this.context.flux.getStore('session').getCurrentUser(),
    });
  }

  @autobind
  logout() {
    const { flux, history } = this.context;
    flux.getActions('session').logout().then(() => {
      history.pushState(null, '/login');
    });
  }

  renderEmptyHeader() {
    return (
      <Navbar justified>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">ЕТС</Link>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }

  renderHeader() {
    const { user } = this.state;
    const path = this.props.location.pathname;
    const isOkrug = user.okrug_id !== null;

    return (
      <Navbar justified fluid>

        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">ЕТС</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav>
            <NavItem permissions={[PERMISSIONS.monitor]} active={path === '/monitor'} href="#/monitor">Карта</NavItem>
            <NavDropdown hidden={isOkrug} oneOfPermissions={[PERMISSIONS.odh_coverage_report, PERMISSIONS.dt_coverage_report]} title="Оперативная обстановка" id="nav-dropdown-1">
              <MenuItem permissions={[PERMISSIONS.odh_coverage_report]} active={path === '/odh_coverage_report'} href="#/odh_coverage_report">Отчет по посещению ОДХ</MenuItem>
              <MenuItem permissions={[PERMISSIONS.dt_coverage_report]} active={path === '/dt_coverage_report'} href="#/dt_coverage_report">Отчет по посещению ДТ</MenuItem>
            </NavDropdown>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.dashboard]} active={path === '/dashboard'} href="#/dashboard">Рабочий стол</NavItem>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.waybill.list]} active={path === '/waybill-journal'} href="#/waybill-journal">Путевые листы</NavItem>

            <NavDropdown hidden={isOkrug} oneOfPermissions={PERMISSIONS.missions.list} title="Задания" id="nav-dropdown-1">
              <MenuItem permissions={['mission.list']} active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
              <MenuItem permissions={['mission_template.list']} active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
              <MenuItem permissions={['duty_mission.list']} active={path === '/duty-missions-journal'} href="#/duty-missions-journal">Журнал наряд-заданий</MenuItem>
              <MenuItem permissions={['duty_mission_template.list']} active={path === '/duty-mission-templates-journal'} href="#/duty-mission-templates-journal">Шаблоны наряд-заданий</MenuItem>
            </NavDropdown>

            <NavDropdown oneOfPermissions={PERMISSIONS.nsi.list} title="НСИ" id="nav-dropdown-2">
              <MenuItem permissions={['employee.list']} active={path === '/employees'} href="#/employees">Реестр сотрудников</MenuItem>
              <MenuItem permissions={['faxogramm.list']} active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>
              <MenuItem permissions={['technical_operation.list']} active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
              <MenuItem divider />
              <NavDropdown oneOfPermissions={['type.list', 'car.list']} title="Транспортные средства" id="nav-dropdown-2-1">
                <MenuItem permissions={['type.list']} active={path === '/car-func-types'} href="#/car-func-types">Типы техники</MenuItem>
                <MenuItem permissions={['car.list']} active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
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
              <MenuItem permissions={['user_action_log.list']} divider />
              <MenuItem permissions={['user_action_log.list']} active={path === '/user-action-log'} href="#/user-action-log">Журнал действий пользователя</MenuItem>
              {/* <MenuItem active={path === '/organizations'} href="#/organizations">Справочник организаций</MenuItem>*/}
            </NavDropdown>

            <NavDropdown oneOfPermissions={[PERMISSIONS.report.list]} title="Отчеты" id="nav-dropdown-3">
              <NavDropdown title="Оперативные отчеты" id="nav-dropdown-3-1">
                <MenuItem active={path === '/route-reports'} href="#/route-reports">Покрытие ОДХ маршрутами</MenuItem>
                <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
                <MenuItem active={path === '/car_func_type_usage_reports'} href="#/car_func_type_usage_reports">Статистика выхода техники</MenuItem>
                <MenuItem active={path === '/brigade-efficiency-report'} href="#/brigade-efficiency-report">Работа бригад по ручной уборке</MenuItem>
                <MenuItem active={path === '/employee-efficiency-reports'} href="#/employee-efficiency-reports">Работа сотрудников по ручной уборке</MenuItem>
              </NavDropdown>
              <NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
                <MenuItem active={path === '/fuel-consumption-report'} href="#/fuel-consumption-report">Расход топлива</MenuItem>
                <MenuItem active={path === '/track-events-reports'} href="#/track-events-reports">Возможные сливы топлива</MenuItem>
                <MenuItem active={path === '/daily-cleaning-reports-ets'} href="#/daily-cleaning-reports-ets">Статус по уборке</MenuItem>
                <MenuItem active={path === '/daily-cleaning-reports-cafap'} href="#/daily-cleaning-reports-cafap">Статус по уборке (ЦАФАП)</MenuItem>
                <MenuItem active={path === '/weekly-technical-operation-complete-reports'} href="#/weekly-technical-operation-complete-reports">Статус по выполнению технологических операций</MenuItem>
              </NavDropdown>
              <NavDropdown title="Графические отчеты" id="nav-dropdown-3-3">
                <MenuItem active={path === '/coverage-report'} href="#/coverage-report">
                  Графический отчет покрытия объектов городского хозяйства (ОДХ, ДТ)
                </MenuItem>
              </NavDropdown>
              <MenuItem active={path === '/analytics'} href="#/analytics">Аналитика</MenuItem>
            </NavDropdown>

            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.route.list]} active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.company_structure.list]} active={path === '/company-structure'} href="#/company-structure">Структура предприятия</NavItem>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.administration]} title="Администрирование" href={`http://213.79.88.5/${process.env.STAND !== 'prod' ? 'ets-test/' : ''}admin`}><Glyphicon glyph="list-alt" /></NavItem>
          </Nav>

          <Nav pullRight>
            <NavDropdown title="Руководство пользователей" id="nav-dropdown-4">
              <MenuItem href="http://ets.tech.mos.ru/ets-test/docs/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%9C%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0_27_01_2016.docx">Руководство Мастера</MenuItem>
              <MenuItem href="http://ets.tech.mos.ru/ets-test/docs/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D0%B4%D0%B8%D1%81%D0%BF%D0%B5%D1%82%D1%87%D0%B5%D1%80%D0%B0%20_27_01_2017.docx">Руководство Диспетчера</MenuItem>
            </NavDropdown>
            <NavItem className="navbar-user">
              <div className="navbar-user__avatar">
                <img role="presentation" src={defaultUser} className="navbar-user__avatar-img" />
              </div>
              <div className="navbar-user__data">
                <div className="navbar-user__data-type">{ROLES[user.role || ''] || ''}</div>
                <div className="navbar-user__data-name">{user.fio}</div>
              </div>
            </NavItem>
            <NavItem onClick={this.logout}>Выйти</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  render() {
    const path = this.props.location.pathname;
    if (path === '/login') {
      return (
        <div className="loginpage">
          <div className="wrap">
            {this.props.children}
          </div>
          <span style={{ position: 'absolute', right: 8, bottom: 5, opacity: 0.2 }}>
            {VERSION_DESCRIPTION}
          </span>
        </div>
      );
    }
    return (
      <div className="app">
        <div className="app-navigation">{this.renderHeader()}</div>

        <div className="app-content">
          {this.props.children}
          <LoadingOverlay main />
        </div>

        <div className="app-footer">
          {this.state.user.company_name}
          <span style={{ position: 'absolute', right: 20 }}>
            {VERSION_DESCRIPTION}
          </span>
        </div>
      </div>
    );
  }

}
