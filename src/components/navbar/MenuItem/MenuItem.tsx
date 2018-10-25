import * as React from 'react';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import connectToStores from 'flummox/connect';


const checkShow = props => {
  let isShow = true;

  if (props.data.hiddenNav) {
    isShow = false;
  } else {
    const {
      data,
      data: { permissions },
    } = props;
    if (!data.alwaysShow && permissions) {
      const { userPermissions } = props;
      const { list } = permissions;
      if (Array.isArray(list)) {
        isShow = list.some(permission => userPermissions.includes(permission));
      } else {
        isShow = userPermissions.includes(list);
      }
    }

    if (props.data.checkHidden) {
      isShow = props.data.checkHidden(isShow, props);
    }
  }

  return isShow;
};

const propsToMenuItem = [
  'id',
  'active',
  'eventKey',
  'href',
  'onKeyDown',
  'onSelect',
  'className',
];

const MenuItemCustom: React.SFC<any> = (props, context) =>
  checkShow(props)
  ?
  (
    props.data.divider
    ?
    <MenuItem divider />
    :
    <MenuItem
      { ...propsToMenuItem.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {}) }
    >
      {props.data.title}
    </ MenuItem>
  )
  :
  <div className="none" />
;

export default connectToStores(MenuItemCustom, ['session']);
  