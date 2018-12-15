import * as React from 'react';
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown';

import { showHeaderMenu } from 'components/app_header/utils';

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

const NavDropdownCustom: React.FunctionComponent<any> = (props) =>
  <NavDropdown { ...propsToNavDropdown.reduce((newProps, key) => ({ ...newProps, [key]: props[key] }), {} )} />
;

export default showHeaderMenu(NavDropdownCustom);
