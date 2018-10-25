import * as React from 'react';
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown';

import connectToStores from 'flummox/connect';

const checkShow = props => {
  let isShow = false;

  if (props.data.hiddenNav) {
    isShow = false;
  } else if (props.data.alwaysShow) {
    isShow = true;
  } else if (props.data.permissions) {
    isShow = props.data.permissions.list.some(perm => perm === true || props.userPermissions.includes(perm));
  }

  if (props.data.checkHidden) {
    isShow = props.data.checkHidden(isShow, props);
  }

  return isShow;
}

const propsToNavDropdown: any = [
  'id',
  'active',
  'eventKey',
  'activeKey',
  'activeHref',
  'onSelect',
  'title',
  'children',
  'className',
];

const NavDropdownCustom: React.SFC<any> = props =>
  checkShow(props)
  ?
    <NavDropdown { ...propsToNavDropdown.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {} )} />
  :
    <div className="none" />
;

export default connectToStores(NavDropdownCustom, ['session']);
  