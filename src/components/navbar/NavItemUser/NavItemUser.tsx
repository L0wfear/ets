import * as React from 'react';
import connectToStores from 'flummox/connect';

import NavItem from 'components/navbar/NavItem/NavItem';
const defaultUser = require('assets/images/avatar-default.png') as string;

const ROLES = {
  master: 'Мастер',
  dispatcher: 'Диспетчер',
  prefect: 'Префект',
  superuser: 'Администратор',
};

const data = {
  alwaysShow: true,
}

const NavItemUser: React.SFC<any> = ({ currentUser }) =>
  <NavItem id={'info-user-data'} className="navbar-user" data={data}>
    <div className="navbar-user__avatar">
      <img role="presentation" src={defaultUser} className="navbar-user__avatar-img" />
    </div>
    <div className="navbar-user__data">
      <div className="navbar-user__data-type">{ROLES[currentUser.role || ''] || ''}</div>
      <div className="navbar-user__data-name">{currentUser.fio}</div>
    </div>
  </NavItem>;

export default connectToStores(NavItemUser, ['session']);
