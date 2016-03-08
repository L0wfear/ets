import React, { Component } from 'react';
import { Link, History } from 'react-router';
import { MenuItem, Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';
import fluxMixin from 'flummox/mixin';
import LoadingOverlay from './LoadingOverlay.jsx';

export default React.createClass({

  mixins: [ History ],

  getInitialState() {
    return {
      user: {login: 'Пользователь'},
    }
  },

  contextTypes: {
    flux: React.PropTypes.object,
    history: React.PropTypes.object,
  },

	renderHeader() {
		let path = this.props.location.pathname;
		//console.log( path, this.props );

    if (path === '/login') return (<Navbar justified>
						 <Navbar.Header>
					      <Navbar.Brand>
							    <Link to="/">ЕТС</Link>
					      </Navbar.Brand>
					    </Navbar.Header>
				      <Nav>
				      </Nav>
					</Navbar>);

		return (<Navbar justified fluid>
						 <Navbar.Header>
                             <Navbar.Brand>
							    <Link to="/">ЕТС</Link>
                             </Navbar.Brand>
					    </Navbar.Header>
            {/*<div className="navbar-collapse collapse">*/}
				      <Nav>
                <NavItem active={path === '/monitor'} href="#/monitor">Монитор</NavItem>
				        <NavItem active={path === '/dashboard'} href="#/dashboard">Рабочий стол</NavItem>
                {/*<NavDropdown title="Рабочее место" id="nav-dropdown-5">
  				        <MenuItem active={path === '/dashboard/master'} href="#/dashboard/master">Рабочее место мастера</MenuItem>
    				      <MenuItem active={path === '/dashboard/dispatcher'} href="#/dashboard/dispatcher">Рабочее место диспетчера</MenuItem>
                </NavDropdown>*/}
				        <NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Путевые листы</NavItem>
                <NavDropdown title="Задания" id="nav-dropdown-1">
				          <MenuItem active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
  				        <MenuItem active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
                </NavDropdown>
                <NavDropdown title="НСИ" id="nav-dropdown-2">
                  <MenuItem active={path === '/drivers'} href="#/drivers">Реестр водителей</MenuItem>
  				        <MenuItem active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
  				        <MenuItem active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>
  				        <MenuItem active={path === '/faxogramms'} href="#/faxogramms">Реестр факсограмм</MenuItem>

                  <MenuItem divider />

  				        <MenuItem active={path === '/fuel-rates'} href="#/fuel-rates">Справочник норм расхода топлива</MenuItem>
                  <MenuItem active={path === '/odh'} href="#/odh">Справочник ОДХ</MenuItem>
                </NavDropdown>

                <NavDropdown title="Отчеты" id="nav-dropdown-3">
				          <MenuItem active={path === '/odh-reports'} href="#/odh-reports">ОДХ</MenuItem>
  				        <MenuItem active={path === '/route-reports'} href="#/route-reports">Покрытие ОДХ маршрутами</MenuItem>
  				        <MenuItem active={path === '/mission-reports'} href="#/mission-reports">Прохождение заданий</MenuItem>
                </NavDropdown>

				        <NavItem active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
				      </Nav>
              <Nav pullRight>
                  <NavItem className="navbar-user">
                      <div className="navbar-user__avatar">
                          <img src="/images/avatar-default.png" className="navbar-user__avatar-img" />
                      </div>
                      <div className="navbar-user__data">
                          <div className="navbar-user__data-type">Мастер</div>
                          <div className="navbar-user__data-name">{this.state.user.login}</div>
                      </div>
                  </NavItem>
                  <NavItem onClick={this.logout} >Выйти</NavItem>
              </Nav>
            {/*</div>*/}
					</Navbar>)
	},

  logout() {
    this.context.flux.getActions('session').logout().then(() => {
      this.context.history.pushState(null, '/login');
    });
  },

  componentDidMount() {
    this.setState({user: this.context.flux.getStore('session').getCurrentUser()});
  },

  componentWillReceiveProps() {
    this.setState({user: this.context.flux.getStore('session').getCurrentUser()});
  },

  render() {
		return <div className="app">
						<div className="app-navigation">{this.renderHeader()}</div>
						<div className="app-content">
              {this.props.children}
              <LoadingOverlay/>
            </div>
					</div>
  },

})
