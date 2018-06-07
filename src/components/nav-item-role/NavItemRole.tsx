import * as React from 'react';
import { NavItem } from 'react-bootstrap';
import { connectToStores } from 'utils/decorators';
import CompanyOptions from 'components/nav-item-role/CompanyOptions';

@connectToStores(['session'])
class NavItemRole extends React.Component<any, any> {
  render() {
    return (
      this.props.isGlavControl && this.props.location.pathname !== '/change-company'
      ?
      <NavItem className={'company-switcher'}>
        <span className={'company-switcher-label'}>Текущая организация:</span>
        <CompanyOptions history={this.props.history} location={this.props.location} />
      </NavItem>
      :
      <div className="none"></div>
    )
  }
}

export default NavItemRole;
