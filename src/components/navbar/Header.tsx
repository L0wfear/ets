import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as Navbar from 'react-bootstrap/lib/Navbar';
import * as Nav from 'react-bootstrap/lib/Nav';

import NavDropdown from 'components/navbar/NavDropdown/NavDropdown';
import NavItem from 'components/navbar/NavItem/NavItem';
import MenuItem from 'components/navbar/MenuItem/MenuItem';
import NavItemUser from 'components/navbar/NavItemUser/NavItemUser';
import NavItemLogout from 'components/navbar/NavItemLogout/NavItemLogout';
import NavItemRole from 'components/nav-item-role/NavItemRole';
import NavItemBackToGorod from 'components/nav-item-role/NavItemBackToGorod';

import docs from 'components/doc-header/_config-data/index';

import rWithP from 'constants/routerAndPermission';
import { ETSLogo } from 'components/navbar/styled';

const makeNavDropChildren = ([key, data]) => {
  if ((data.path || data.divider) && !data.renderNav) {
    return <MenuItem key={key} id={`link-${key}`} className={data.className} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data} />;
  }
  if (data.children && !data.renderNav) {
    return (
      <NavDropdown key={key} id={`show-${key}`} className={data.className} data={data} title={data.title}>
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    );
  }

  if (data.renderNav) {
    return data.renderNav(key, data);
  }

  return null;
};

const makeNavChildren = ([key, data]) => {
  if (data.path && !data.renderNav) {
    return <NavItem key={key} id={`link-${key}`} className={data.className} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data} />;
  }
  if (data.children && !data.render) {
    return (
      <NavDropdown key={key} id={`show-${key}`} className={data.className} data={data} title={data.title}>
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    );
  }
  if (data.renderNav) {
    return data.renderNav(key, data);
  }

  return null;
};

const dataGuide = {
  backToCity: {
    renderNav: () => <NavItemBackToGorod key={'change-role-to-city'}/>,
  },
  changeRole: {
    renderNav: () => <NavItemRole key={'change-role'}/>,
  },
  docs,
  userData: {
    renderNav: (key) => <NavItemUser key={'info-user-data'} />,
  },
  logout: {
    renderNav: (key) => <NavItemLogout key={'link-logout'} />,
  },
};

const Header = (props) => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <ETSLogo>ЕТС</ETSLogo>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav activeKey={props.match.url}>
        { Object.entries(rWithP).map(makeNavChildren) }
      </Nav>
      <Nav pullRight>
        { Object.entries(dataGuide).map(makeNavChildren) }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default withRouter(Header);
