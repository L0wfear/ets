import * as React from 'react';
import { NavItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

const propsToNaItem = [
  'id',
  'active',
  'activeHref',
  'activeKey',
  'eventKey',
  'href',
  'onSelect',
  'className',
];

const checkPermission = props => {
  let show = true;

  if (props.data.hiddenNav) {
    show = false;
  } else {
    const {
      data,
      data: { permissions },
    } = props;
    if (!data.alwaysShow && permissions) {
      const { userPermissions } = props;
      const { list } = permissions;
      if (Array.isArray(list)) {
        show = list.some(permission => userPermissions.includes(permission));
      } else {
        show = userPermissions.includes(list);
      }
    }

    if (data.checkHidden) {
      show = data.checkHidden(show, props);
    }
  }

  return show;
}

const NavItemCustom: React.SFC<any> = props => (
  checkPermission(props)
  ?
  <NavItem { ...propsToNaItem.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {}) }>
    {props.data.title ? props.data.title : undefined}
    {props.children}
  </ NavItem>
  :
  <div className="none" />
);

export default connectToStores(NavItemCustom, ['session']);
  