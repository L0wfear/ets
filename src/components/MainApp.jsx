import React, { PropTypes } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import ModalTP from 'components/modalTP/ModalTP.tsx';

import getRouters from 'components/indexRoute.jsx';

import { FluxContext } from 'utils/decorators';
import PERMISSIONS from 'constants/permissions';
import NotificationBage from 'components/notifications/NotificationBadge.tsx';
import NotifiactionOrders from 'components/modal_notification/NotifiactionOrders.tsx';

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
class MainApp extends React.Component {

  static get propTypes() {
    return {
      match: PropTypes.object,
      history: PropTypes.object,
    };
  }

  constructor() {
    super();

    this.state = {
      user: {},
      showFormTp: false,
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

  logout = () => {
    const { flux } = this.context;
    flux.getActions('session').logout().then(() => {
      this.props.history.push('/login');
      clearInterval(this.checkUsNotifInterval);
    });
  }

  hideFormTp = () => this.setState({ showFormTp: false });
  showFormTp = () => this.setState({ showFormTp: true });

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
    const {
      user,
    } = this.state;
    const path = this.props.match.url;
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
            <NavDropdown id="show-coverage-report" hidden={true} oneOfPermissions={[PERMISSIONS.odh_coverage_report, PERMISSIONS.dt_coverage_report]} title="Оперативная обстановка">
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

            <NavItem id="link-notification-registry" includesPartOfText={['_notification.list']} title="Уведомления пользователей" active={path === '/notification-registry'} href="#/notification-registry"><span>Уведомления <NotificationBage /></span></NavItem>
            <NavItem id="link-admin" hidden={isOkrug} permissions={[PERMISSIONS.administration]} title="Администрирование" href={`http://213.79.88.5/${process.env.STAND !== 'prod' ? 'ets-stage2/' : ''}admin`}><Glyphicon glyph="list-alt" /></NavItem>
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
          {getRouters(this.props)}
          <LoadingOverlay main />
          <NotifiactionOrders />
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


export default withRouter(MainApp);
