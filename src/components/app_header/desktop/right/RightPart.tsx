import * as React from 'react';

import BackToGorod from 'components/app_header/desktop/right/back_to_gorod/BackToGorod';
import ChangeRole from 'components/app_header/desktop/right/change_role/ChangeRole';
import DocsMenu from 'components/app_header/desktop/right/docs_menu/DocsMenu';
import UserInfo from 'components/app_header/desktop/right/user_info/UserInfo';
import EtsLogout from 'components/app_header/desktop/right/ets_logout/EtsLogout';
import { PartHeaderContainer } from 'components/app_header/styled';

class RightPart extends React.Component<any, any> {
  render() {
    const {
      width,
    } = this.props;

    return (
      <PartHeaderContainer>
        <BackToGorod width={width} changeStaticWidth={this.props.changeStaticWidth} />
        <ChangeRole width={width} changeStaticWidth={this.props.changeStaticWidth} />
        <DocsMenu width={width} changeStaticWidth={this.props.changeStaticWidth} />
        <UserInfo width={width} changeStaticWidth={this.props.changeStaticWidth} />
        <EtsLogout width={width} changeStaticWidth={this.props.changeStaticWidth} />
      </PartHeaderContainer>
    );
  }
}

export default RightPart;
