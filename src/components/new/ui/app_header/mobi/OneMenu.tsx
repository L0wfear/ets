import * as React from 'react';
import * as Collapse from 'react-bootstrap/lib/Collapse';
import { DivNone } from 'global-styled/global-styled';
import { isObject } from 'util';
import { withRouterMatchUrl, showHeaderMenu, isActivemenu } from 'components/new/ui/app_header/utils';
import { DivDivider, LinkSecontLvl } from 'components/new/ui/app_header/styled';
import * as ClickOutHandler from 'react-onclickout';
import { SecondMenuItemContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled/index';
import { SecondMenuContainerMobi, DefaultSecondLvlMenuMobi } from 'components/new/ui/app_header/mobi/styled';

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

    return (
      <LinkSecontLvl id={`link-${key}`} to={`${data.path || ''}`} onClick={this.handleMiddlewareClick}>
        <DefaultSecondLvlMenuMobi>
          <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
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
    const { data, matchUrl } = this.props;

    const active = !!isActivemenu(matchUrl, data.path, data.childrenPath);

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <SecondMenuItemContainer active={this.state.showChildren || active}>
          {this.getTitle()}
          {
            isObject(data.children)
            ? (
              <Collapse in={showChildren}>
                <div>
                  <SecondMenuContainerMobi>
                    { Object.entries(data.children).map(this.mapRWithP) }
                  </SecondMenuContainerMobi>
                </div>
              </Collapse>
            )
            : (
              <DivNone />
            )
          }
        </SecondMenuItemContainer>
      </ClickOutHandler>
    );
  }
}

const OneMenuWrap = showHeaderMenu(withRouterMatchUrl(OneMenu));

export default OneMenuWrap;
