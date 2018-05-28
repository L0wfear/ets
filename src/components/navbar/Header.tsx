import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import NavDropdown from 'components/navbar/NavDropdown/NavDropdown';
import NavItem from 'components/navbar/NavItem/NavItem';
import MenuItem from 'components/navbar/MenuItem/MenuItem';
import { withRouter } from 'react-router-dom';
import NavItemUser from 'components/navbar/NavItemUser/NavItemUser';
import NavItemLogout from 'components/navbar/NavItemLogout/NavItemLogout';

import config from 'config';

import rWithP from 'constants/routerAndPermission';

const makeNavDropChildren = ([key, data]) => {
  if (data.path || data.divider) {
    return <MenuItem key={key} id={`link-${key}`} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data} />
  }
  if (data.children) {
    return (
      <NavDropdown key={key} id={`show-${key}`} data={data} title={data.title}>
       
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    )
  }
}

const makeNavChildren = ([key, data]) => {
  if (data.path) {
    return <NavItem key={key} id={`link-${key}`} href={`${data.noHash ? '' : '#'}${data.path}`} eventKey={data.path} data={data}/>
  }
  if (data.children) {
    return (
      <NavDropdown key={key} id={`show-${key}`} data={data} title={data.title}>
        {
          Object.entries(data.children).map(makeNavDropChildren)
        }
      </NavDropdown>
    )
  }
  if (data.render){
    return data.render(key, data);
  }

  return null;
}

const dataGuide = {
  guide: {
    title: 'Руководство пользователей',
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
    render: (key) => <NavItemUser key={'info-user-data'} />,
  },
  logout: {
    render: (key) => <NavItemLogout key={'link-logout'} />,
  }
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
