import * as React from 'react';
import * as  NavItem from 'react-bootstrap/lib/NavItem';
import { showHeaderMenu } from 'components/app_header/utils';

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

const NavItemCustom: React.FunctionComponent<any> = (props) => (
  <NavItem { ...propsToNaItem.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {}) }>
    {props.data.title ? props.data.title : undefined}
    {props.children}
  </ NavItem>
);

export default showHeaderMenu(NavItemCustom);
