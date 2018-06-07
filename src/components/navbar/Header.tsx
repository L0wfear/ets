import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Glyphicon,
  Navbar,
  Nav,
} from 'react-bootstrap';
import NavDropdown from 'components/navbar/NavDropdown/NavDropdown';
import NavItem from 'components/navbar/NavItem/NavItem';
import MenuItem from 'components/navbar/MenuItem/MenuItem';
import NavItemUser from 'components/navbar/NavItemUser/NavItemUser';
import NavItemLogout from 'components/navbar/NavItemLogout/NavItemLogout';
import NavItemRole from 'components/nav-item-role/NavItemRole';

import config from 'config';

import rWithP from 'constants/routerAndPermission';

const makeNavDropChildren = ([key, data]) => {
  if ((data.path || data.divider) && !data.renderNav) {
    return <MenuItem key={key} id={`link-${key}`} className={data.className} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data} />
  }
  if (data.children && !data.renderNav) {
    return (
      <NavDropdown key={key} id={`show-${key}`} className={data.className} data={data} title={data.title}>
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    )
  }

  if (data.renderNav){
    return data.renderNav(key, data);
  }

  return null;
}

const makeNavChildren = ([key, data]) => {
  console.log(key, data)
  if (data.path && !data.renderNav) {
    return <NavItem key={key} id={`link-${key}`} className={data.className} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data} />
  }
  if (data.children && !data.render) {
    return (
      <NavDropdown key={key} id={`show-${key}`} className={data.className} data={data} title={data.title}>
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    )
  }
  if (data.renderNav){
    return data.renderNav(key, data);
  }

  return null;
}

const dataGuide = {
  changeRole: {
    renderNav: (key) => <NavItemRole key={'change-role'}/>
  },
  guide: {
    title: <Glyphicon glyph="book" />,
    className: "user-guide",
    alwaysShow: true,
    children: {
      master: {
        title: 'Руководство Мастера',
        path: `${config.docs}Руководство-мастера.docx`,
        noHash: true,
        alwaysShow: true,
      },
      dispather: {
        title: 'Руководство Диспетчера',
        path: `${config.docs}Руководство-диспетчера.docx`,
        noHash: true,
        alwaysShow: true,
      },
      okrug: {
        title: 'Руководство окружного пользователя',
        path: `${config.docs}Руководство-окружного-пользователя.docx`,
        noHash: true,
        alwaysShow: true,
      },
      report: {
        title: 'Общие рекомендации по обращению',
        path: `${config.docs}Общие_рекомендации_по_обращению.docx`,
        noHash: true,
        alwaysShow: true,
      },
      engineer: {
        title: 'Руководство инженера ТО',
        path: `${config.docs}Руководство-Инженер ТО.docx`,
        noHash: true,
        alwaysShow: true,
      }
    }
  },
  userData: {
    renderNav: (key) => <NavItemUser key={'info-user-data'} />,
  },
  logout: {
    renderNav: (key) => <NavItemLogout key={'link-logout'} />,
  },
};

const Header = props => (
  <Navbar fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <Link id="link-main-page" to="/">ЕТС</Link>
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
)

export default withRouter(Header);
