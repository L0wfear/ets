import * as React from 'react';
import { NavItem, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connectToStores, FluxContext } from 'utils/decorators';

@withRouter
@connectToStores(['session'])
@FluxContext
class NavItemBackToGorod extends React.Component<any, any> {
  handleSelect = () =>
    this.context.flux.getActions('session').cahngeCompanyOnAnother(null)
      .then(() => this.props.history.push('/change-company'));

  render() {
    return (
      this.props.isGlavControl && this.props.currentUser.company_id !== null
      ?
      <NavItem id="button-back-to-city" className={'company-switcher-back-to-city'} onSelect={this.handleSelect}>
        <div className="switcher-tooltiptext">Возврат на уровень города</div>
        <Glyphicon glyph="arrow-left"/>
      </NavItem>
      :
      <div className="none"></div>
    )
  }
}

export default NavItemBackToGorod;
