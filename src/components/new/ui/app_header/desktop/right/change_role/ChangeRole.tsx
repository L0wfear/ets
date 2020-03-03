import * as React from 'react';

import CompanyOptionsNew from 'components/new/ui/app_header/desktop/right/change_role/CompanyOptionsNew';
import { ChangeRoleContainer, CompanyOptionsNewContainer } from 'components/new/ui/app_header/desktop/right/change_role/styled';
import {
  DivNone,
} from 'global-styled/global-styled';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class ChangeRole extends React.Component<any, {}> {
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

  render() {
    const {
      isGlavControl,
      match,
    } = this.props;

    return isGlavControl && match.url !== '/change-company'
      ? (
        <ChangeRoleContainer ref={this.node}>
          <span>Текущая организация:</span>
          <CompanyOptionsNewContainer>
            <CompanyOptionsNew />
          </CompanyOptionsNewContainer>
        </ChangeRoleContainer>
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
      isGlavControl: getSessionState(state).userData.isGlavControl,
    }),
  ),
)(ChangeRole);
