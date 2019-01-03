import * as React from 'react';

import EtsLogo from 'components/new/ui/app_header/desktop/left/ets_logo/EtsLogo';
import PageMenu from 'components/new/ui/app_header/desktop/left/page_menu/PageMenu';
import { PartHeaderContainer } from 'components/new/ui/app_header/styled';

class LeftPart extends React.Component<any, any> {
  render() {
    const {
      staticNodeWidth,
      width,
    } = this.props;

    return (
      <PartHeaderContainer>
        <EtsLogo width={width} changeStaticWidth={this.props.changeStaticWidth} />
        <PageMenu permittedWidth={(width - staticNodeWidth)} staticNodeWidth={staticNodeWidth} />
      </PartHeaderContainer>
    );
  }
}

export default LeftPart;
