import React, { Component } from 'react';
import { Link } from 'react-router';
import { MenuItem, Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';
import LoadingOverlay from './LoadingOverlay.jsx';

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
            <MenuItem active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
            <MenuItem active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
            <MenuItem active={path === '/duty-missions-journal'} href="#/duty-missions-journal">Журнал наряд-заданий</MenuItem>
            <MenuItem active={path === '/duty-mission-templates-journal'} href="#/duty-mission-templates-journal">Шаблоны наряд-заданий</MenuItem>
          </NavDropdown>
          <NavDropdown title="НСИ" id="nav-dropdown-2">
            <MenuItem active={path === '/employees'} href="#/employees">Реестр сотрудников</MenuItem>
            <MenuItem active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
            <MenuItem active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
            <MenuItem active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>

            <MenuItem divider />

            <MenuItem active={path === '/fuel-rates'} href="#/fuel-rates">Справочник норм расхода топлива</MenuItem>
            <MenuItem active={path === '/fuel-operations'} href="#/fuel-operations">Справочник операций для расчета топлива</MenuItem>
            <MenuItem active={path === '/odh'} href="#/odh">Справочник ОДХ</MenuItem>
            <MenuItem active={path === '/dt'} href="#/dt">Справочник ДТ</MenuItem>
          </NavDropdown>

          <NavDropdown title="Отчеты" id="nav-dropdown-3">
            {/*<MenuItem active={path === '/odh-reports'} href="#/odh-reports">ОДХ</MenuItem>*/}
            <MenuItem active={path === '/route-reports'} href="#/route-reports">Покрытие ОДХ маршрутами</MenuItem>
            <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
            <MenuItem active={path === '/daily-cleaning-reports'} href="#/daily-cleaning-reports">Статус по уборке проезжей части</MenuItem>
            <MenuItem active={path === '/weekly-technical-operation-complete-reports'} href="#/weekly-technical-operation-complete-reports">Статус по выполнению технологических операций</MenuItem>
          </NavDropdown>

          <NavItem active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
          <NavItem active={path === '/company-structure'} href="#/company-structure">Структура предприятия</NavItem>
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
