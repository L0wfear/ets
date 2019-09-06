import * as React from 'react';
import { connect } from 'react-redux';

import { sessionCahngeCompanyOnAnother } from 'redux-main/reducers/modules/session/actions-session';

import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { isNull } from 'util';
import { BackToGorodContainer } from 'components/new/ui/app_header/desktop/right/back_to_gorod/styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class BackToGorod extends React.Component<any, any> {
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

  handleSelect = async () => {
    try {
      await this.props.sessionCahngeCompanyOnAnother(null);

      this.props.history.push('/change-company');
    } catch (e) {
      console.warn(e); // tslint:disable-line
    }
  }

  render() {
    const {
      userData,
    } = this.props;

    const show = userData.isGlavControl && !isNull(userData.company_id);

    return show
      ? (
        <BackToGorodContainer ref={this.node} id="button-back-to-city" onClick={this.handleSelect} title="Возврат на уровень города">
          <EtsBootstrap.Glyphicon glyph="arrow-left"/>
        </BackToGorodContainer>
      )
      : (
        <DivNone />
      );
  }
}

export default compose<any, any>(
  withSearch,
  connect<any, any, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      sessionCahngeCompanyOnAnother: (company_id) => (
        dispatch(
          sessionCahngeCompanyOnAnother(
            company_id,
            { page: 'main' },
          ),
        )
      ),
    }),
  ),
)(BackToGorod);
