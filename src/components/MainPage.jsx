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
import Div from 'components/ui/Div.jsx';

import config from 'config';
import { autobind } from 'core-decorators';
import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import ModalTP from 'components/modalTP/ModalTP.tsx';
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

const styleNotificationInfo = {
  display: 'flex',
  flexDirection: 'row-reverse',
};

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
          uid: 'gotoets2',
          children: (
            <div>
              <p>
                На 27.02.2018 с 13:00 до 16:00 запланированы регламентные работы в ЦОД. В указанное время могут наблюдаться сбои в работе системы ЕТС.
              </p>
                <p style={styleNotificationInfo}><Button onClick={this.closeError}>Закрыть</Button></p>
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
    global.NOTIFICATION_SYSTEM.removeNotification('gotoets2');
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
            <Link id="link-main-page" to="/">ЕТС</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav>
            <NavItem id="link-monitor" permissions={[PERMISSIONS.monitor]} active={path === '/monitor'} href="#/monitor">Карта</NavItem>
            <NavDropdown id="show-coverage-report" hidden={isOkrug} oneOfPermissions={[PERMISSIONS.odh_coverage_report, PERMISSIONS.dt_coverage_report]} title="Оперативная обстановка">
              <MenuItem id="link-odh_coverage_report" permissions={[PERMISSIONS.odh_coverage_report]} active={path === '/odh_coverage_report'} href="#/odh_coverage_report">Отчет по посещению ОДХ</MenuItem>
              <MenuItem id="link-dt_coverage_report" permissions={[PERMISSIONS.dt_coverage_report]} active={path === '/dt_coverage_report'} href="#/dt_coverage_report">Отчет по посещению ДТ</MenuItem>
            </NavDropdown>
            <NavItem id="link-dashboard" hidden={isOkrug} permissions={[PERMISSIONS.dashboard]} active={path === '/dashboard'} href="#/dashboard">Рабочий стол</NavItem>
            <NavItem id="link-waybill-journal" hidden={isOkrug} permissions={[PERMISSIONS.waybill.list]} active={path === '/waybill-journal'} href="#/waybill-journal">Путевые листы</NavItem>

            <MissionsNavItem {...defaultProps} />
            <NsiNavItem {...defaultProps} />
            <ReportsNavItem {...defaultProps} />

            <NavItem id="link-routes-list" hidden={isOkrug} permissions={[PERMISSIONS.route.list]} active={path === '/routes-list'} href="#/routes-list">Маршруты</NavItem>
            <NavItem id="link-company-structure" hidden={isOkrug} permissions={[PERMISSIONS.company_structure.list]} active={path === '/company-structure'} href="#/company-structure">Структура предприятия</NavItem>
            <NavItem id="link-program-registry" permissions={[PERMISSIONS.repair.list]} active={path === '/program-registry'} href="#/program-registry">Планирование ремонтных работ</NavItem>

            <NavItem id="link-notification-registry" title="Уведомления пользователей" active={path === '/notification-registry'} href="#/notification-registry"><div style={{ fontSize: 18 }}><Glyphicon glyph="exclamation-sign" /></div></NavItem>
            <NavItem id="link-admin" hidden={isOkrug} permissions={[PERMISSIONS.administration]} title="Администрирование" href={`http://213.79.88.5/${process.env.STAND !== 'prod' ? 'ets-stage/' : ''}admin`}><Glyphicon glyph="list-alt" /></NavItem>
          </Nav>

          <Nav pullRight>
            <NavDropdown id="show-guide" title="Руководство пользователей">
              <MenuItem id="link-master" href={`${config.docs}Руководство-мастера.docx`}>Руководство Мастера</MenuItem>
              <MenuItem id="link-dispather" href={`${config.docs}Руководство-диспетчера.docx`}>Руководство Диспетчера</MenuItem>
              <MenuItem id="link-okrug" href={`${config.docs}Руководство-окружного-пользователя.docx`}>Руководство окружного пользователя</MenuItem>
              <MenuItem id="link-report" href={`${config.docs}Общие_рекомендации_по_обращению.docx`}>Общие рекомендации по обращению</MenuItem>
              <MenuItem id="link-engineer" href={`${config.docs}Руководство-Инженер ТО.docx`}>Руководство инженера ТО</MenuItem>
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
            <NavItem id="link-login" onClick={this.logout}>Выйти</NavItem>
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
    const {
      user: {
        structure_name = '',
        company_name,
      },
    } = this.state;

    return (
      <div className="app">
        <div className="app-navigation">{this.renderHeader()}</div>

        <div className="app-content">
          <ModalTP
            show={this.state.showFormTp}
            onHide={this.hideFormTp}
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
            <span>{`${company_name} ${structure_name}`}</span>
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
