import React, { Component } from 'react';
import { Link } from 'react-router';
import { MenuItem as BootstrapMenuItem, Navbar, Nav, NavItem, NavDropdown, Glyphicon} from 'react-bootstrap';
import { enhanceWithPermissions } from './util/RequirePermissions.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';

const MenuItem = enhanceWithPermissions(BootstrapMenuItem);

export default class MainPage extends React.Component {

  constructor() {
    super();

    this.state = {
      user: {
        login: 'Пользователь'
      }
    };
  }

  static contextTypes = {
    flux: React.PropTypes.object,
    history: React.PropTypes.object
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
		let path = this.props.location.pathname;

    if (path === '/login') return this.renderEmptyHeader();

		return (
      <Navbar justified fluid>

        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">ЕТС</Link>
          </Navbar.Brand>
        </Navbar.Header>

        <Nav>
          <NavItem active={path === '/monitor'} href="#/monitor">Карта</NavItem>
          <NavItem active={path === '/dashboard'} href="#/dashboard">Рабочий стол</NavItem>
          <NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Путевые листы</NavItem>
          <NavDropdown title="Задания" id="nav-dropdown-1">
            <MenuItem permissions={['mission.list']} active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
            <MenuItem permissions={['mission_template.list']} active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
            <MenuItem permissions={['duty_mission.list']} active={path === '/duty-missions-journal'} href="#/duty-missions-journal">Журнал наряд-заданий</MenuItem>
            <MenuItem permissions={['duty_mission_template.list']} active={path === '/duty-mission-templates-journal'} href="#/duty-mission-templates-journal">Шаблоны наряд-заданий</MenuItem>
          </NavDropdown>
          <NavDropdown title="НСИ" id="nav-dropdown-2">
            <MenuItem permissions={['employee.list']} active={path === '/employees'} href="#/employees">Реестр сотрудников</MenuItem>
            <MenuItem permissions={['car.list']} active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
            <MenuItem permissions={['technical_operation.list']} active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
            <MenuItem permissions={['faxogramm.list']} active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>

            <MenuItem divider />

            <MenuItem permissions={['fuel_consumption_rate.list']} active={path === '/fuel-rates'} href="#/fuel-rates">Справочник норм расхода топлива</MenuItem>
            <MenuItem permissions={['fuel_operations.list']} active={path === '/fuel-operations'} href="#/fuel-operations">Справочник операций для расчета топлива</MenuItem>
            <MenuItem permissions={['types.list']} active={path === '/car-func-types'} href="#/car-func-types">Справочник типов техники</MenuItem>
            <MenuItem permissions={['odh.list']} active={path === '/odh'} href="#/odh">Справочник ОДХ</MenuItem>
            <MenuItem permissions={['dt.list']} active={path === '/dt'} href="#/dt">Справочник ДТ</MenuItem>
            <MenuItem permissions={['ssp.list']} active={path === '/ssp'} href="#/ssp">Справочник ССП</MenuItem>
            <MenuItem permissions={['msp.list']} active={path === '/msp'} href="#/msp">Справочник МСП</MenuItem>
            <MenuItem permissions={['fueling_water.list']} active={path === '/fueling-water'} href="#/fueling-water">Справочник баз гидрантов</MenuItem>
            <MenuItem permissions={['carpool.list']} active={path === '/carpool'} href="#/carpool">Справочник Автобаз</MenuItem>
            <MenuItem permissions={['danger_zone.list']} active={path === '/danger-zones'} href="#/danger-zones">Справочник особо опасных мест</MenuItem>
            {/*<MenuItem active={path === '/organizations'} href="#/organizations">Справочник организаций</MenuItem>*/}
          </NavDropdown>

          <NavDropdown title="Отчеты" id="nav-dropdown-3">
            <NavDropdown title="Оперативные отчеты" id="nav-dropdown-3-1">
              <MenuItem active={path === '/route-reports'} href="#/route-reports">Покрытие ОДХ маршрутами</MenuItem>
              <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
            </NavDropdown>
            <NavDropdown title="Регламентированные отчеты" id="nav-dropdown-3-2">
              <MenuItem active={path === '/fuel-report'} href="#/fuel-report">Расход топлива</MenuItem>
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

          <NavItem active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
          <NavItem active={path === '/company-structure'} href="#/company-structure">Структура предприятия</NavItem>
          <NavItem title="Администрирование" href="http://213.79.88.5/admin/"><Glyphicon glyph="list-alt"/></NavItem>
        </Nav>

        <Nav pullRight>
          <NavItem className="navbar-user">
            <div className="navbar-user__avatar">
              <img src="images/avatar-default.png" className="navbar-user__avatar-img" />
            </div>
            <div className="navbar-user__data">
              <div className="navbar-user__data-type">{this.state.user.role === 'master' ? 'Мастер' : 'Диспетчер'}</div>
              <div className="navbar-user__data-name">{this.state.user.fio}</div>
            </div>
          </NavItem>
          <NavItem onClick={this.logout.bind(this)} >Выйти</NavItem>
        </Nav>

      </Navbar>
    )

	}

  logout() {
    this.context.flux.getActions('session').logout().then(() => {
      this.context.history.pushState(null, '/login');
    });
  }

  componentDidMount() {
    this.setState({user: this.context.flux.getStore('session').getCurrentUser()});
  }

  componentWillReceiveProps() {
    this.setState({user: this.context.flux.getStore('session').getCurrentUser()});
  }

  render() {
		return (
      <div className="app">
				<div className="app-navigation">{this.renderHeader()}</div>

				<div className="app-content">
          {this.props.children}
          <LoadingOverlay/>
        </div>

        <div className="app-footer">{this.state.user.company_name}</div>
			</div>
    );
  }

}
