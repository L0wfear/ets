import * as React from 'react';
import { connect } from 'react-redux';

import {
  sessionSetData,
} from 'redux-main/reducers/modules/session/actions-session';

import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { withRouter } from 'react-router-dom';
import { connectToStores, FluxContext } from 'utils/decorators';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { isNull } from 'util';
import { BackToGorodContainer } from 'components/app_header/desktop/right/back_to_gorod/styled';

/* tslint:disable */
const BackToGorod = compose<any, any>(
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
    node = React.createRef<any>();

    getSnapshotBeforeUpdate(prevProps) {
      if (prevProps.width < this.props.width) {
        const { current } = this.node;
        if (current) {
          return current.offsetWidth;
        }
      }
      return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (snapshot !== null) {
        const { current } = this.node;
        if (current && this.props.changeStaticWidth) {
          this.props.changeStaticWidth(current.offsetWidth - snapshot);
        }
      }
    }

    componentDidMount() {
      const { current } = this.node;

      if (current && this.props.changeStaticWidth) {
        this.props.changeStaticWidth(current.offsetWidth);
      }
    }

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
      const {
        isGlavControl,
        currentUser,
      } = this.props;

      const show = isGlavControl && !isNull(currentUser.company_id);

      return show
        ? (
          <BackToGorodContainer ref={this.node} id="button-back-to-city" onClick={this.handleSelect} title="Возврат на уровень города">
            <Glyphicon glyph="arrow-left"/>
          </BackToGorodContainer>
        )
        : (
          <DivNone />
        );
    }
  }
);
/* tslint:enable */

export default BackToGorod;
