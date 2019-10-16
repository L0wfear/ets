import * as React from 'react';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

import {
  DefaultFirstDt,
  LinkFirstLvl,
  DefaultFirstLvlMenuLogout,
} from 'components/new/ui/app_header/styled';
import { sessionResetData } from 'redux-main/reducers/modules/session/actions-session';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type StateProps = {};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  width?: number;
  changeStaticWidth?: (width: number) => any;
};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

class EtsLogout extends React.Component<Props, {}> {
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

  handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    this.props.dispatch(sessionResetData());
  };

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

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  null,
)(EtsLogout);
