import * as React from 'react';
import { PageMenuMainDl, SecondMenuContainer } from 'components/new/ui/app_header/desktop/right/docs_menu/styled/index';

import docs from 'components/new/pages/doc_header/_config-data/index';
import * as ClickOutHandler from 'react-onclickout';
import { DefaultFirstDt, LinkFirstLvl, DefaultFirstLvlMenu } from 'components/new/ui/app_header/styled/index';
import SecondDocsMenuItem from 'components/new/ui/app_header/desktop/right/docs_menu/SecondDocsMenuItem';
import { DivNone } from 'global-styled/global-styled';

class PageMenu extends React.Component<any, any> {
  node = React.createRef<any>();
  state = {
    showChildren: false,
  };

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

  handleClickToOpenMenu: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    this.setState({
      showChildren: !this.state.showChildren,
    });
  };

  hiddenChildren = () => {
    this.setState({ showChildren: false });
  };

  handleClickOut = () => {
    if (this.state.showChildren) {
      this.setState({ showChildren: false });
    }
  };

  renderChildrenItem = ([keyName, data]) => {
    return (
      <SecondDocsMenuItem
        key={keyName}
        keyName={keyName}
        data={data}
        position="left"
        hiddenChildren={this.hiddenChildren}
      />
    );
  };

  render() {
    return (
      <PageMenuMainDl ref={this.node}>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <DefaultFirstDt ref={this.node} active={this.state.showChildren}>
            <LinkFirstLvl id={`show-docs`} to="" onClick={this.handleClickToOpenMenu}>
              <DefaultFirstLvlMenu>
                <span>{docs.title}</span>
                <span className="caret"/>
              </DefaultFirstLvlMenu>
            </LinkFirstLvl>
            {
              this.state.showChildren
                ? (
                  <SecondMenuContainer position="bottom_left">
                    {
                      Object.entries(docs.children).map(this.renderChildrenItem)
                    }
                  </SecondMenuContainer>
                )
                : (
                  <DivNone />
                )
            }
          </DefaultFirstDt>
        </ClickOutHandler>
      </PageMenuMainDl>
    );
  }
}

export default PageMenu;
