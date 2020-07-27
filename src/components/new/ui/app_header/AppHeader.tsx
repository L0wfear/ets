import * as React from 'react';
import { AppHeaderNav } from 'components/new/ui/app_header/styled';

import AppHeaderDesktop from 'components/new/ui/app_header/desktop/AppHeaderDesktop';
import AppHeaderMobi from 'components/new/ui/app_header/mobi/AppHeaderMobi';
import { mobiSize } from 'global-styled/global-constants';
import { get_browser } from 'utils/functions';
import { isUndefined } from 'util';

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

        if (event.key === 'e' || event.key === 'E') {
          event.preventDefault();
        }

        if (get_browser().name === 'Firefox') {
          const charCode = isUndefined(event.which) ? event.keyCode : event.which;
          const metaCode = event.metaKey;
          const charStr = String.fromCharCode(charCode);
          if (charStr.match(/[a-zA-Z]+/g) && !metaCode) {
            event.preventDefault();
          }
        }

        if (event.key === '.') {
          event.preventDefault();
        }

        if (event.key === ','
          && (
            event.target?.value?.toString().includes(',')
            || event.target?.value?.toString().includes('.')
          )
        ) { // вводим максимум одну запятую
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
  };

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
