import * as React from 'react';

import { MobiContainer, FirstLvlMobi, SecondMenuContainerMobiFirst, ChangeRoleContainerWithButton, UserDocRow} from 'components/app_header/mobi/styled';
import EtsLogo from 'components/app_header/desktop/left/ets_logo/EtsLogo';
import * as Button from 'react-bootstrap/lib/Button';
import * as Collapse from 'react-bootstrap/lib/Collapse';
import rWithP from 'constants/routerAndPermission';
import BackToGorod from 'components/app_header/desktop/right/back_to_gorod/BackToGorod';
import ChangeRole from 'components/app_header/desktop/right/change_role/ChangeRole';
import UserInfo from 'components/app_header/desktop/right/user_info/UserInfo';
import EtsLogout from 'components/app_header/desktop/right/ets_logout/EtsLogout';
import docs from 'components/doc-header/_config-data/index';

import OneMenuWrap from 'components/app_header/mobi/OneMenu';
import * as ClickOutHandler from 'react-onclickout';

class AppHeader extends React.Component<any, any> {
  state = {
    showChildren: false,
  };
  toggleShowMenu = () => {
    this.setState((state) => ({
      showChildren: !state.showChildren,
    }));
  }
  hiddenChildren = () => {
    this.setState(() => ({
      showChildren: false,
    }));
  }
  mapRWithP = ([key, data]) => {
    return (
      <OneMenuWrap key={key} keyName={key} data={data} hiddenChildren={this.hiddenChildren}/>
    );
  }
  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState(() => ({
        showChildren: false,
      }));
    }
  }
  render() {
    const { showChildren } = this.state;

    console.log(showChildren) // tslint:disable-line

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <MobiContainer>
          <FirstLvlMobi>
            <EtsLogo />
            <Button active={showChildren} onClick={this.toggleShowMenu}>Меню</Button>
          </FirstLvlMobi>
          <Collapse in={showChildren}>
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
                <UserDocRow>
                  <UserInfo />
                  <EtsLogout />
                </UserDocRow>
              </SecondMenuContainerMobiFirst>
            </div>
          </Collapse>
        </MobiContainer>
      </ClickOutHandler>
    );
  }
}

export default AppHeader;
