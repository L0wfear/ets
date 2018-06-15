import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';
import { connectToStores } from 'utils/decorators';
import CompanyOptions from 'components/nav-item-role/CompanyOptions';

@withRouter
@connectToStores(['session'])
class NavItemRole extends React.Component<any, any> {
  render() {
    return (
      this.props.isGlavControl && this.props.location.pathname !== '/change-company'
      ?
      <NavItem id="change-company" className={'company-switcher'}>
        <span className={'company-switcher-label'}>Текущая организация:</span>
        <CompanyOptions />
      </NavItem>
      :
      <div className="none"></div>
    )
  }
}

export default NavItemRole;