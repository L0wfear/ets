import * as React from 'react';

import LeftPart from 'components/new/ui/app_header/desktop/left/LeftPart';
import RightPart from 'components/new/ui/app_header/desktop/right/RightPart';
import { DesktopContainer } from 'components/new/ui/app_header/desktop/styled/index';

class AppHeader extends React.Component<any, any> {
  node = React.createRef<any>();
  state = {
    staticNodeWidth: 0,
  };

  changeStaticWidth = (changedWidth) => {
    this.setState((state) => ({
      staticNodeWidth: state.staticNodeWidth + changedWidth,
    }));
  };

  render() {
    const {
      staticNodeWidth,
    } = this.state;
    const { width } = this.props;

    return (
      <DesktopContainer ref={this.node}>
        <LeftPart
          width={width}
          staticNodeWidth={staticNodeWidth}
          changeStaticWidth={this.changeStaticWidth}
        />
        <RightPart
          width={width}
          changeStaticWidth={this.changeStaticWidth}
        />
      </DesktopContainer>
    );
  }
}

export default AppHeader;
