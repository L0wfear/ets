import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionSetData,
} from 'redux-main/reducers/modules/session/actions-session';

import * as NavItem from 'react-bootstrap/lib/NavItem';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { withRouter } from 'react-router-dom';
import { connectToStores, FluxContext } from 'utils/decorators';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';

/* tslint:disable */
const NavItemBackToGorodWrap = compose(
  withRouter,
  connect< any, any, any, ReduxState>(
    null,
    (dispatch) => ({
      sessionSetData: (props) => dispatch(sessionSetData(props)),
    }),
  ),
)(
  @connectToStores(['session'])
  @FluxContext
  class extends React.Component<any, any> {
    context!: ETSCore.LegacyContext;

    handleSelect = () => {
      this.context.flux.getActions('session').cahngeCompanyOnAnother(null)
        .then(({ payload, token }) => {
          this.props.sessionSetData({
            currentUser: payload,
            session: token,
          });

          this.props.history.push('/change-company')
        })
    }

    render() {
      return (
        this.props.isGlavControl && this.props.currentUser.company_id !== null
        ?
        <NavItem id="button-back-to-city" className={'company-switcher-back-to-city'} onClick={this.handleSelect}>
          <div className="switcher-tooltiptext">Возврат на уровень города</div>
          <Glyphicon glyph="arrow-left"/>
        </NavItem>
        :
        <DivNone />
      )
    }
  }
);
/* tslint:enable */

export default NavItemBackToGorodWrap;
