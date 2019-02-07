import * as React from 'react';
import { DefaultFirstLvlMenu, LinkFirstLvl, LinkNoHashFirstLvl, DefaultFirstDt } from 'components/new/ui/app_header/styled';
import { DivNone } from 'global-styled/global-styled';
import SecondMenuItem from 'components/new/ui/app_header/desktop/left/page_menu/SecondMenuItem';
import { SecondMenuContainer } from 'components/new/ui/app_header/desktop/left/page_menu/styled';
import * as ClickOutHandler from 'react-onclickout';
import { withRouterMatchUrl, isActivemenu, showHeaderMenu } from 'components/new/ui/app_header/utils';

class MainMenuItem extends React.Component<any, any> {
  node = React.createRef<any>();
  state = {
    showChildren: false,
  };

  componentDidMount() {
    const { current } = this.node;

    if (current && this.props.changeWidthByKeyName) {
      this.props.changeWidthByKeyName(
        this.props.keyName,
        current.offsetWidth,
      );
    }
  }

  handleClickToOpenMenu: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    this.setState({
      showChildren: !this.state.showChildren,
    });
  }

  hiddenChildren = () => {
    this.setState({ showChildren: false });
  }

  getItem = () => {
    const {
      keyName: key,
      data,
    } = this.props;

    if (data.children) {
      return (
        <LinkFirstLvl id={`show-${key}`} to="" onClick={this.handleClickToOpenMenu}>
          <DefaultFirstLvlMenu>
            <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
            <span className="caret"/>
          </DefaultFirstLvlMenu>
        </LinkFirstLvl>
      );
    }

    if (data.noHash) {
      return (
        <LinkNoHashFirstLvl id={`link-${key}`} href={data.path}>
          <DefaultFirstLvlMenu>
            <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
          </DefaultFirstLvlMenu>
        </LinkNoHashFirstLvl>
      );
    }

    return (
      <LinkFirstLvl id={`link-${key}`} to={`${data.path || ''}`}>
        <DefaultFirstLvlMenu>
          <span>{data.TitleComponent ? <data.TitleComponent data={data} /> : data.title}</span>
        </DefaultFirstLvlMenu>
      </LinkFirstLvl>
    );
  }

  renderChildrenItem = ([keyName, data]) => {
    return (
      <SecondMenuItem
        key={keyName}
        keyName={keyName}
        data={data}
        position="right"
        hiddenChildren={this.hiddenChildren}
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
      statusShow,
      data,
      matchUrl,
    } = this.props;
    const {
      path,
      childrenPath,
    } = data;

    const active = !!isActivemenu(matchUrl, path, childrenPath);

    return (
      statusShow
        ? (
          <ClickOutHandler onClickOut={this.handleClickOut}>
            <DefaultFirstDt ref={this.node} active={this.state.showChildren || active}>
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
            </DefaultFirstDt>
          </ClickOutHandler>
        )
        : (
          <DivNone />
        )
    );
  }
}

export default showHeaderMenu(withRouterMatchUrl(MainMenuItem));
