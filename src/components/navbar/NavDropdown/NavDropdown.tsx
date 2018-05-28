import * as React from 'react';
import { NavDropdown } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

const checkShow = props => {
  let isShow = false;

  if (props.data.hiddenNav) {
    isShow = false;
  } else if (props.data.alwaysShow) {
    isShow = true;
  } else if (props.data.permissions) {
    isShow = props.data.permissions.list.some(perm => props.userPermissions.includes(perm));
  }

  return isShow;
}

const propsToNavDropdown: any = [
  'id',
  'active',
  'eventKey',
  'onSelect',
  'title',
  'children'
];

const NavDropdownCustom: React.SFC<any> = props =>
  checkShow(props)
  ?
    <NavDropdown { ...propsToNavDropdown.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {} )} />
  :
    <div className="none" />
;

export default connectToStores(NavDropdownCustom, ['session']);
  