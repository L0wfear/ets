import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
  Col,
  Button,
  Navbar, Nav, Glyphicon,
  NavItem as BootstrapNavItem,
  NavDropdown as BootstrapNavDropdown,
  MenuItem as BootstrapMenuItem,
} from 'react-bootstrap';
import moment from 'moment';

import Div from 'components/ui/Div.jsx';

import config from 'config';
import { autobind } from 'core-decorators';
import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import ModalTP from 'components/modalTP/ModalTP.tsx';
import ModalRule from 'components/modalTP/ModalRule.tsx';
import { FluxContext, HistoryContext } from 'utils/decorators';
import PERMISSIONS from 'constants/permissions';
import enhanceWithPermissions from './util/RequirePermissions.jsx';
import defaultUser from '../assets/images/avatar-default.png';

import MissionsNavItem from './navbar/MissionsNavItem';
import NsiNavItem from './navbar/nsi';
import ReportsNavItem from './navbar/reports';

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
      showForm: false,
    };
  }

  componentWillMount() {
    const user = this.context.flux.getStore('session').getCurrentUser();

    this.setState({
      user,
      needShowHrefOnNewProd: [10227244, 102266640].includes(user.company_id),
    });
  }

  componentDidMount() {
    if (this.context.flux.getStore('session').isLoggedIn()) {
      const isSee = this.context.flux.getStore('session').isSeeNotifyProblem();

      if (!isSee) {
        global.NOTIFICATION_SYSTEM.notifyWithObject({
          title: 'Уважаемые пользователи !',
          level: 'success',
          position: 'tr',
          dismissible: false,
          autoDismiss: 0,
          uid: 'error_asuods',
          children: (
            <div>
              <p>
              С 09:00ч 10.02.2018 по 09:00ч. 11.02.2018 запланировано проведение регламентных работ. 
              В системе ЕТС будет наблюдаться задержка в подсчете процента прохождения заданий. 
              Данные будут обработаны в полном объеме в течении суток, после завершения работ.</p>
              <p
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}
              ><Button onClick={this.closeError}>Закрыть</Button></p>
            </div>
          ),
        });
      }
    }
  }

  componentWillReceiveProps() {
    this.setState({
      user: this.context.flux.getStore('session').getCurrentUser(),
    });
  }
  closeError = () => {
    global.NOTIFICATION_SYSTEM.removeNotification('error_asuods');
    this.context.flux.getStore('session').setAsSee(true);
  }

  @autobind
  logout() {
    const { flux, history } = this.context;
    flux.getActions('session').logout().then(() => {
      history.pushState(null, '/login');
    });
  }
  hideFormTp = () => this.setState({ showFormTp: false });
  showFormTp = () => this.setState({ showFormTp: true });

  hideFormRule = () => {
    this.context.history.pushState(null, '/monitor');
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
    const defaultProps = { isOkrug, path };

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

            <MissionsNavItem {...defaultProps} />
            <NsiNavItem {...defaultProps} />
            <ReportsNavItem {...defaultProps} />

            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.route.list]} active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.company_structure.list]} active={path === '/company-structure'} href="#/company-structure">Структура предприятия</NavItem>
            <NavItem title="Уведомления пользователей" active={path === '/notification-registry'} href="#/notification-registry"><div style={{ fontSize: 18 }}><Glyphicon glyph="exclamation-sign" /></div></NavItem>
            <NavItem hidden={isOkrug} permissions={[PERMISSIONS.administration]} title="Администрирование" href={`http://213.79.88.5/${process.env.STAND !== 'prod' ? 'ets-test/' : ''}admin`}><Glyphicon glyph="list-alt" /></NavItem>
          </Nav>

          <Nav pullRight>
            <NavDropdown title="Руководство пользователей" id="nav-dropdown-4">
              <MenuItem href={`${config.docs}Руководство-мастера.docx`}>Руководство Мастера</MenuItem>
              <MenuItem href={`${config.docs}Руководство-диспетчера.docx`}>Руководство Диспетчера</MenuItem>
              <MenuItem href={`${config.docs}Руководство-окружного-пользователя.docx`}>Руководство окружного пользователя</MenuItem>
              <MenuItem href={`${config.docs}Общие_рекомендации_по_обращению.docx`}>Общие рекомендации по обращению</MenuItem>
              <MenuItem href={`${config.docs}Руководство-Инженер ТО.docx`}>Руководство инженера ТО</MenuItem>
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
          <ModalTP
            show={this.state.showFormTp}
            onHide={this.hideFormTp}
          />
          <ModalRule
            show={
              path.includes('showFormRule') &&
              moment(new Date()).format(`${global.APP_DATE_FORMAT} HH:mm`) > moment('2017-11-01T00:00:00').format(`${global.APP_DATE_FORMAT} HH:mm`) &&
              moment(new Date()).format(`${global.APP_DATE_FORMAT} HH:mm`) < moment('2017-11-01T18:00:00').format(`${global.APP_DATE_FORMAT} HH:mm`)
            }
            onHide={this.hideFormRule}
          />
          {this.props.children}
          <LoadingOverlay main />
        </div>

        <div className="app-footer">
          <Col md={3}>
            <Div hidden={this.state.needShowHrefOnNewProd}>
              <Col md={12}>
                <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
              </Col>
            </Div>
            <Div hidden={!this.state.needShowHrefOnNewProd}>
              <Col md={6}>
                <a className="tp" onClick={this.showFormTp}>Техническая поддержка</a>
              </Col>              <Col md={6}>
                <a className="tp not-red" href='https://ets2.mos.ru' >Переход на новую версию</a>
              </Col>
            </Div>
          </Col>
          <Col md={6}>
            {this.state.user.company_name}
          </Col>
          <Col md={3}>
            <span style={{ position: 'absolute', right: 20 }}>
              {VERSION_DESCRIPTION}
            </span>
          </Col>
        </div>
      </div>
    );
  }

}
