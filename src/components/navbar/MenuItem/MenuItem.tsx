import * as React from 'react';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import { showHeaderMenu } from 'components/app_header/utils';

const propsToMenuItem = [
  'id',
  'active',
  'eventKey',
  'href',
  'onKeyDown',
  'onSelect',
  'className',
];

const MenuItemCustom: React.FunctionComponent<any> = (props) =>
  props.data.divider
    ? (
      <MenuItem divider />
    )
    : (
      <MenuItem
      { ...propsToMenuItem.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {}) }
      >
      {props.data.title}
    </ MenuItem>
  )
;

export default showHeaderMenu(MenuItemCustom);
