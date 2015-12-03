import React, { Component } from 'react';
import { Link, History } from 'react-router';
import { MenuItem, Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';
export default React.createClass({

  mixins: [ History ], 

	renderHeader() {
		let path = this.props.location.pathname;
		console.log( path, this.props );

		return (<Navbar justified>
						 <Navbar.Header>
					      <Navbar.Brand>
							    <Link to="/">ЕТС</Link>
					      </Navbar.Brand>
					    </Navbar.Header>
				      <Nav>
				        <NavItem active={path === '/monitor'} href="#/monitor">Монитор</NavItem>
				        <NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Журнал путевых листов</NavItem>
				        <NavItem active={path === '/employees'} href="#/employees">Реестр сотрудников</NavItem>
				        <NavItem active={path === '/routes-list'} href="#/routes-list">Список маршрутов</NavItem>
				        <NavItem active={path === '/waybill-journal/create'} href="#/waybill-journal/create">Создать маршрут</NavItem>
				        {/*<NavItem active={path === '/waybill-journal'} href="#/waybill-journal">Журнал путевых листов</NavItem>
				        <NavDropdown eventKey={3} title="Реестры" id="basic-nav-dropdown">
				          	<MenuItem>Реестр сотрудников</MenuItem>
					        	<MenuItem>Реестр водителей</MenuItem>
					        	<MenuItem><Link to="/routes-list">Реестр маршрутов</Link></MenuItem>
				        </NavDropdown>*/}
				      </Nav>
					</Navbar>)
	},

  render() {
		return <div>
						<div className="app-navigation">{this.renderHeader()}</div>
						<div className="app-content">{this.props.children}</div>
					</div>	
  }
})