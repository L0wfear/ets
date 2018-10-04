import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionSetData,
} from 'redux/modules/session/actions-session';

import { NavItem, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connectToStores, FluxContext } from 'utils/decorators';

import {
  DivNone,
} from 'global-styled/global-styled';

@withRouter
@connect(
  null,
  dispatch => ({
    sessionSetData: props => dispatch(sessionSetData(props)),
  }),
)
@connectToStores(['session'])
@FluxContext
class NavItemBackToGorod extends React.Component<any, any> {
  handleSelect = () =>
    this.context.flux.getActions('session').cahngeCompanyOnAnother(null)
      .then(({ payload, token }) => {
        this.props.sessionSetData({
          currentUser: payload,
          session: token,
        });

        this.props.history.push('/change-company')
      });

  render() {
    return (
      this.props.isGlavControl && this.props.currentUser.company_id !== null
      ?
      <NavItem id="button-back-to-city" className={'company-switcher-back-to-city'} onSelect={this.handleSelect}>
        <div className="switcher-tooltiptext">Возврат на уровень города</div>
        <Glyphicon glyph="arrow-left"/>
      </NavItem>
      :
      <DivNone />
    )
  }
}

export default NavItemBackToGorod;
