import * as React from 'react';
import { AppHeaderNav } from 'components/new/app_header/styled';

import AppHeaderDesktop from 'components/new/app_header/desktop/AppHeaderDesktop';
import AppHeaderMobi from 'components/new/app_header/mobi/AppHeaderMobi';

class AppHeader extends React.Component<{}, any> {
  node = React.createRef<any>();
  state = {
    width: document.body.offsetWidth,
    mobi: document.body.offsetWidth < 768,
  };

  componentDidMount() {
    window.addEventListener(
      'resize',
      this.resizeWindow,
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  resizeWindow = () => {
    this.setState(() => ({
      width: document.body.offsetWidth,
      mobi: document.body.offsetWidth < 768,
    }));
  }

  render() {
    const {
      width,
    } = this.state;

    return (
      <AppHeaderNav ref={this.node}>
        {
          this.state.mobi
          ? (
            <AppHeaderMobi width={width} />
          )
          : (
            <AppHeaderDesktop width={width} />
          )
        }
      </AppHeaderNav>
    );
  }
}

export default AppHeader;
