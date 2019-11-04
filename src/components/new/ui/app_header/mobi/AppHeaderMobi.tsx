import * as React from 'react';

import { MobiContainer, FirstLvlMobi, SecondMenuContainerMobiFirst, ChangeRoleContainerWithButton, SecondMenuItemContainerMobi, MenuButton } from 'components/new/ui/app_header/mobi/styled';
import EtsLogo from 'components/new/ui/app_header/desktop/left/ets_logo/EtsLogo';

import rWithP from 'constants/routerAndPermission';
import BackToGorod from 'components/new/ui/app_header/desktop/right/back_to_gorod/BackToGorod';
import ChangeRole from 'components/new/ui/app_header/desktop/right/change_role/ChangeRole';
import UserInfo from 'components/new/ui/app_header/desktop/right/user_info/UserInfo';
import EtsLogout from 'components/new/ui/app_header/desktop/right/ets_logout/EtsLogout';
import docs from 'components/new/pages/doc_header/_config-data/index';

import OneMenuWrap from 'components/new/ui/app_header/mobi/OneMenu';
import * as ClickOutHandler from 'react-onclickout';
import EtsBootstrap from '../../@bootstrap';

class AppHeader extends React.Component<any, any> {
  state = {
    showChildren: false,
  };
  toggleShowMenu = () => {
    this.setState((state) => ({
      showChildren: !state.showChildren,
    }));
  };
  hiddenChildren = () => {
    this.setState(() => ({
      showChildren: false,
    }));
  };
  mapRWithP = ([key, data]) => {
    return (
      <OneMenuWrap key={key} keyName={key} data={data} hiddenChildren={this.hiddenChildren}/>
    );
  };
  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState(() => ({
        showChildren: false,
      }));
    }
  };
  render() {
    const { showChildren } = this.state;

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <MobiContainer>
          <FirstLvlMobi>
            <EtsLogo />
            <MenuButton active={showChildren} onClick={this.toggleShowMenu}>Меню</MenuButton>
          </FirstLvlMobi>
          <EtsBootstrap.Collapse in={showChildren}>
            <div>
              <SecondMenuContainerMobiFirst>
                {
                  Object.entries(rWithP).map(this.mapRWithP)
                }
                <ChangeRoleContainerWithButton>
                  <BackToGorod />
                  <ChangeRole />
                </ChangeRoleContainerWithButton>
                {
                  this.mapRWithP(['doc', docs])
                }
                <SecondMenuItemContainerMobi>
                  <UserInfo />
                </SecondMenuItemContainerMobi>
                <SecondMenuItemContainerMobi>
                  <EtsLogout />
                </SecondMenuItemContainerMobi>

              </SecondMenuContainerMobiFirst>
            </div>
          </EtsBootstrap.Collapse>
        </MobiContainer>
      </ClickOutHandler>
    );
  }
}

export default AppHeader;
