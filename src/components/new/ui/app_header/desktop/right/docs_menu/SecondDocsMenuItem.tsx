import * as React from 'react';
import { SecondMenuContainer } from 'components/new/ui/app_header/desktop/right/docs_menu/styled';
import { DefaultSecondLvlMenu, LinkSecontLvl } from 'components/new/ui/app_header/styled';
import * as ClickOutHandler from 'react-onclickout';
import { DivNone } from 'global-styled/global-styled';
import { showHeaderMenu } from 'components/new/ui/app_header/utils';
import { SecondMenuItemContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled/index';

class SecondDocsMenuItem extends React.Component<any, any> {
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

    if (data.children) {
      return (
        <LinkSecontLvl id={`show-${key}`} to="" onClick={this.handleClickToOpenMenu}>
          <DefaultSecondLvlMenu>
            <span>{data.title}</span>
            <span className="caret"/>
          </DefaultSecondLvlMenu>
        </LinkSecontLvl>
      );
    }

    return (
      <LinkSecontLvl id={`link-${key}`} to={data.path} onClick={this.handleMiddlewareClick}>
        <DefaultSecondLvlMenu>
          <span>{data.title}</span>
        </DefaultSecondLvlMenu>
      </LinkSecontLvl>
    );
  }

  renderChildrenItem = ([keyName, data]) => {
    return (
      <SecondDocsMenuItemWrap
        key={keyName}
        keyName={keyName}
        data={data}
        hiddenChildren={this.props.hiddenChildren}
        position="bottom_left"
      />
    );
  }

  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState({ showChildren: false });
    }
  }

  render() {
    const { data } = this.props;

    return (
      <ClickOutHandler onClickOut={this.handleClickOut}>
        <SecondMenuItemContainer noneEffect={data.divider || (!data.path && !data.children) } active={this.state.showChildren}>
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

const SecondDocsMenuItemWrap = showHeaderMenu(SecondDocsMenuItem);

export default SecondDocsMenuItemWrap;
