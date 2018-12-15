import * as React from 'react';
import { AppHeaderNav } from 'components/app_header/styled';

import AppHeaderDesktop from 'components/app_header/desktop/AppHeaderDesktop';
import AppHeaderMobi from 'components/app_header/mobi/AppHeaderMobi';

class AppHeader extends React.Component<{}, any> {
  node = React.createRef<any>();
  state = {
    width: document.body.offsetWidth,
    mobi: document.body.offsetWidth < 768,
  };

  componentDidMount() {
    window.onresize = () => {
      this.setState((state) => ({
        width: document.body.offsetWidth,
        mobi: document.body.offsetWidth < 768,
      }));
    };
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
