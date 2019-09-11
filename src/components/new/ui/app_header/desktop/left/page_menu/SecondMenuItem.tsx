import * as React from 'react';
import { compose } from 'recompose';
import * as ClickOutHandler from 'react-onclickout';

import { SecondMenuItemContainer, SecondMenuContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled';
import { DefaultSecondLvlMenu, LinkSecontLvl, LinkNoHashSecontLvl, DivDivider, MenuTitleContainer } from 'components/new/ui/app_header/styled';
import { MarkNewRegistry } from 'global-styled/global-styled';
import { isActivemenu, showHeaderMenu } from 'components/new/ui/app_header/utils';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

class SecondMenuItem extends React.Component<any, any> {
  state = {
    showChildren: false,
  };

  handleClickToOpenMenu: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    this.setState({
      showChildren: !this.state.showChildren,
    });
  }

  handleMiddlewareClick = () => {
    this.props.hiddenChildren();
  }

  getItem = () => {
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
        <LinkSecontLvl id={`show-${key}`} to="" onClick={this.handleClickToOpenMenu}>
          <DefaultSecondLvlMenu>
            <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
            <span className="caret"/>
          </DefaultSecondLvlMenu>
        </LinkSecontLvl>
      );
    }

    if (data.noHash) {
      return (
        <LinkNoHashSecontLvl id={`link-${key}`} href={data.pathFormMenu || data.path} >
          <DefaultSecondLvlMenu>
            <MenuTitleContainer>
              { __DEVELOPMENT__ && data.isNewRegistry && <MarkNewRegistry />}
              {data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}
            </MenuTitleContainer>
          </DefaultSecondLvlMenu>
        </LinkNoHashSecontLvl>
      );
    }

    return (
      <LinkSecontLvl id={`link-${key}`} to={`${data.pathFormMenu || data.path || ''}`} onClick={this.handleMiddlewareClick}>
        <DefaultSecondLvlMenu>
          <MenuTitleContainer>
            { __DEVELOPMENT__ && data.isNewRegistry && <MarkNewRegistry />}
            {data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}
          </MenuTitleContainer>
        </DefaultSecondLvlMenu>
      </LinkSecontLvl>
    );
  }

  renderChildrenItem = ([keyName, data]) => {
    return (
      <SecondMenuItemWithUrl
        key={keyName}
        keyName={keyName}
        data={data}
        hiddenChildren={this.props.hiddenChildren}
        position="right"
      />
    );
  }

  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState({ showChildren: false });
    }
  }

  render() {
    const {
      data,
    } = this.props;

    if (data.divider) {
      return (
        <DivDivider />
      );
    }

    const {
      path,
      childrenPath,
    } = data;

    const active = !!isActivemenu(this.props.match.url, path, childrenPath);

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <SecondMenuItemContainer noneEffect={data.divider || (!data.path && !data.children) } active={this.state.showChildren || active}>
          { this.getItem() }
          {
            this.state.showChildren && (
              <SecondMenuContainer position={this.props.position}>
                {
                  Object.entries(data.children).map(this.renderChildrenItem)
                }
              </SecondMenuContainer>
            )
          }
        </SecondMenuItemContainer>
      </ClickOutHandler>
    );
  }
}

const SecondMenuItemWithUrl = compose<any, any>(
  withSearch,
  showHeaderMenu,
)(SecondMenuItem);

export default SecondMenuItemWithUrl;
