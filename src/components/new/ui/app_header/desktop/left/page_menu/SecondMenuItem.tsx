import * as React from 'react';
import { SecondMenuItemContainer, SecondMenuContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled';
import { DefaultSecondLvlMenu, LinkSecontLvl, DivDivider } from 'components/new/ui/app_header/styled';
import * as ClickOutHandler from 'react-onclickout';
import { DivNone } from 'global-styled/global-styled';
import { withRouterMatchUrl, isActivemenu, showHeaderMenu } from 'components/new/ui/app_header/utils';

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

    return (
      <LinkSecontLvl id={`link-${key}`} to={`${data.path || ''}`} onClick={this.handleMiddlewareClick}>
        <DefaultSecondLvlMenu>
          <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
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
      matchUrl,
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

    const active = !!isActivemenu(matchUrl, path, childrenPath);

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <SecondMenuItemContainer noneEffect={data.divider || (!data.path && !data.children) } active={this.state.showChildren || active}>
          { this.getItem() }
          {
            this.state.showChildren
            ? (
              <SecondMenuContainer position={this.props.position}>
                {
                  Object.entries(data.children).map(this.renderChildrenItem)
                }
              </SecondMenuContainer>
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

const SecondMenuItemWithUrl = showHeaderMenu(withRouterMatchUrl(SecondMenuItem));

export default SecondMenuItemWithUrl;
