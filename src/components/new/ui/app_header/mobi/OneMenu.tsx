import * as React from 'react';
import { compose } from 'recompose';
import { isObject } from 'util';

import { MarkNewRegistry } from 'global-styled/global-styled';
import { showHeaderMenu, isActivemenu } from 'components/new/ui/app_header/utils';
import { DivDivider, LinkSecontLvl, LinkNoHashSecontLvl, MenuTitleContainer } from 'components/new/ui/app_header/styled';
import * as ClickOutHandler from 'react-onclickout';
import { SecondMenuItemContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled/index';
import { SecondMenuContainerMobi, DefaultSecondLvlMenuMobi } from 'components/new/ui/app_header/mobi/styled';
import EtsBootstrap from '../../@bootstrap';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class OneMenu extends React.Component<any, any> {
  state = {
    showChildren: false,
  };
  toggleShowMenu: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      showChildren: !state.showChildren,
    }));
  }
  handleMiddlewareClick = () => {
    this.setState((state) => ({
      showChildren: false,
    }));
    this.props.hiddenChildren();
  }
  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState((state) => ({
        showChildren: false,
      }));
    }
  }

  getTitle = () => {
    const {
      keyName: key,
      data,
    } = this.props;

    if (data.divider) {
      return (
        <DivDivider />
      );
    }

    if (data.children) {
      return (
        <LinkSecontLvl id={`show-${key}`} to="" onClick={this.toggleShowMenu}>
          <DefaultSecondLvlMenuMobi>
            <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
            <span className="caret"/>
          </DefaultSecondLvlMenuMobi>
        </LinkSecontLvl>
      );
    }

    if (data.noHash) {
      return (
        <LinkNoHashSecontLvl id={`link-${key}`} href={data.pathFormMenu || data.path} >
          <DefaultSecondLvlMenuMobi>
            <MenuTitleContainer>
              { __DEVELOPMENT__ && data.isNewRegistry && (
                <EtsBootstrap.OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={(
                    <EtsBootstrap.Popover>
                      Формочка на редаксе
                    </EtsBootstrap.Popover>
                  )}
                  placement="top"
                >
                  <MarkNewRegistry />
                </EtsBootstrap.OverlayTrigger>
              )}
              {data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}
            </MenuTitleContainer>
          </DefaultSecondLvlMenuMobi>
        </LinkNoHashSecontLvl>
      );
    }

    return (
      <LinkSecontLvl id={`link-${key}`} to={`${data.pathFormMenu || data.path || ''}`} onClick={this.handleMiddlewareClick}>
        <DefaultSecondLvlMenuMobi>
          <MenuTitleContainer>
            { __DEVELOPMENT__ && data.isNewRegistry && (
                <EtsBootstrap.OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={(
                    <EtsBootstrap.Popover>
                      Формочка на редаксе
                    </EtsBootstrap.Popover>
                  )}
                  placement="top"
                >
                  <MarkNewRegistry />
                </EtsBootstrap.OverlayTrigger>
              )}
            {data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}
          </MenuTitleContainer>
        </DefaultSecondLvlMenuMobi>
      </LinkSecontLvl>
    );
  }

  mapRWithP = ([key, data]) => {
    return (
      <OneMenuWrap key={key} keyName={key} data={data} hiddenChildren={this.handleMiddlewareClick}/>
    );
  }

  render() {
    const { showChildren } = this.state;
    const { data } = this.props;

    const active = !!isActivemenu(this.props.match.url, data.path, data.childrenPath);

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <SecondMenuItemContainer active={this.state.showChildren || active}>
          {this.getTitle()}
          {
            isObject(data.children) && (
              <EtsBootstrap.Collapse in={showChildren}>
                <div>
                  <SecondMenuContainerMobi>
                    { Object.entries(data.children).map(this.mapRWithP) }
                  </SecondMenuContainerMobi>
                </div>
              </EtsBootstrap.Collapse>
            )
          }
        </SecondMenuItemContainer>
      </ClickOutHandler>
    );
  }
}

const OneMenuWrap = compose<any, any>(
  withSearch,
  showHeaderMenu,
)(OneMenu);

export default OneMenuWrap;
