import * as React from 'react';
import { connectToStores } from 'utils/decorators';
import { withRouter } from 'react-router-dom';

import CompanyOptionsNew from 'components/app_header/desktop/right/change_role/CompanyOptionsNew';
import { ChangeRoleContainer, CompanyOptionsNewContainer } from 'components/app_header/desktop/right/change_role/styled';
import {
  DivNone,
} from 'global-styled/global-styled';

@connectToStores(['session'])
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
      location,
    } = this.props;

    const show = isGlavControl && location.pathname !== '/change-company';

    return show
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

export default withRouter(ChangeRole);
