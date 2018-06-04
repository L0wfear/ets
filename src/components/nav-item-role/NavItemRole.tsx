import * as React from 'react';
import { NavItem } from 'react-bootstrap';
import { connectToStores } from 'utils/decorators';
import CompanyOptions from 'components/nav-item-role/CompanyOptions';

@connectToStores(['session'])
class NavItemRole extends React.Component<any, any> {
  render() {
    return (
      this.props.isGlavControl
      ?
      <NavItem className={'company-switcher'}>
        <CompanyOptions />
      </NavItem>
      :
      <div className="none"></div>
    )
  }
}

export default NavItemRole;
