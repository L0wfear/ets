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

		return (<Navbar justified>
						 <Navbar.Header>
					      <Navbar.Brand>
							    <Link to="/">ЕТС</Link>
					      </Navbar.Brand>
					    </Navbar.Header>
				      <Nav>
				        <NavItem active={path === '/monitor'} href="#/monitor">Монитор</NavItem>
				        <NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Журнал путевых листов</NavItem>
                <NavDropdown title="Задания" id="nav-dropdown-1">
				          <MenuItem active={path === '/mission-journal'} href="#/mission-journal">Журнал заданий</MenuItem>
  				        <MenuItem active={path === '/mission-templates-journal'} href="#/mission-templates-journal">Шаблоны заданий</MenuItem>
                </NavDropdown>
                <NavDropdown title="НСИ" id="nav-dropdown-2">
                  <MenuItem active={path === '/employees'} href="#/employees">Реестр водителей</MenuItem>
  				        <MenuItem active={path === '/cars'} href="#/cars">Реестр транспортных средств</MenuItem>
  				        <MenuItem active={path === '/technical-operations'} href="#/technical-operations">Реестр технологических операций</MenuItem>

                  <MenuItem divider />

  				        <MenuItem active={path === '/fuel-rates'} href="#/fuel-rates">Справочник норм расхода топлива</MenuItem>
                </NavDropdown>
				        <NavItem active={path === '/routes-list'} href="#/routes-list">Список маршрутов</NavItem>
				        {/*<NavItem active={path === '/waybill-journal/create'} href="#/waybill-journal/create">Создать маршрут</NavItem>*/}
				        {/*<NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Журнал путевых листов</NavItem>
				        <NavDropdown eventKey={3} title="Реестры" id="basic-nav-dropdown">
				          	<MenuItem>Реестр сотрудников</MenuItem>
					        	<MenuItem>Реестр водителей</MenuItem>
					        	<MenuItem><Link to="/routes-list">Реестр маршрутов</Link></MenuItem>
				        </NavDropdown>*/}
				      </Nav>
              <Nav pullRight>
                <NavItem >{this.state.user.login}</NavItem>
                <NavItem onClick={this.logout} >Выйти</NavItem>
              </Nav>
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
		return <div>
						<div className="app-navigation">{this.renderHeader()}</div>
						<div className="app-content">
              {this.props.children}
              <LoadingOverlay/>
            </div>
					</div>
  },

})
