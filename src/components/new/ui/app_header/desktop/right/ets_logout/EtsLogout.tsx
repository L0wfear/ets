import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ReduxState } from 'redux-main/@types/state';

import {
  DefaultFirstDt,
  LinkFirstLvl,
  DefaultFirstLvlMenuLogout,
} from 'components/new/ui/app_header/styled';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { sessionResetData } from 'redux-main/reducers/modules/session/actions-session';

class EtsLogout extends React.Component<any, {}> {
  node = React.createRef<any>();
  static get contextTypes() {
    return {
      flux: PropTypes.object,
    };
  }

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

  handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    this.props.sessionResetData();
  }

  render() {
    return (
      <DefaultFirstDt ref={this.node}>
        <LinkFirstLvl id={`link-logout`} to="" onClick={this.handleClick}>
          <DefaultFirstLvlMenuLogout>
            <span>Выйти</span>
          </DefaultFirstLvlMenuLogout>
        </LinkFirstLvl>
      </DefaultFirstDt>
    );
  }
}

export default compose<any, any>(
  connect<any, any, any, ReduxState>(
    null,
    (dispatch) => ({
      sessionResetData: () => (
        dispatch(
          sessionResetData(),
        )
      ),
    }),
  ),
)(EtsLogout);
