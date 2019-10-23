import * as React from 'react';
import { AppHeaderNav } from 'components/new/ui/app_header/styled';

import AppHeaderDesktop from 'components/new/ui/app_header/desktop/AppHeaderDesktop';
import AppHeaderMobi from 'components/new/ui/app_header/mobi/AppHeaderMobi';
import { mobiSize } from 'global-styled/global-constants';

class AppHeader extends React.Component<{}, any> {
  node = React.createRef<any>();
  state = {
    width: document.body.offsetWidth,
    mobi: document.body.offsetWidth < mobiSize,
  };

  componentDidMount() {
    window.addEventListener(
      'resize',
      this.resizeWindow,
    );

    document.addEventListener('keydown', (event: any) => {
      if ('getAttribute' in event.target && event.target.getAttribute('type') === 'number') {
        // e 69
        if (event.keyCode === 69) {
          event.preventDefault();
        }
        // . 190
        if (event.keyCode === 190) {
          event.preventDefault();
        }

      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeWindow);
  }

  resizeWindow = () => {
    this.setState(() => ({
      width: document.body.offsetWidth,
      mobi: document.body.offsetWidth < mobiSize,
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
