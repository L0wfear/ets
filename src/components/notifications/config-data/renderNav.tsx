import * as React from 'react';
import NotificationBage from 'components/notifications/NotificationBadge';
import NavItem from 'components/navbar/NavItem/NavItem';

export default (key, data) => (
  <NavItem key={key} id={`link-${key}`} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data}>
    <NotificationBage />
  </NavItem>
);
