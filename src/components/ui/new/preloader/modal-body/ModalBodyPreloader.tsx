import * as React from 'react';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsModalBodyPreloader = {
  typePreloader?: 'mainpage' | 'graph' | 'field' | 'lazy' | void;
  path?: string;
  page?: string;
};

class ModalBodyPreloader extends React.Component<PropsModalBodyPreloader, {}> {
  render() {
    return (
      <EtsBootstrap.ModalBody {...this.props}>
        {this.props.children}
      </EtsBootstrap.ModalBody>
    );
  }
}

export default withPreloader({})(ModalBodyPreloader);
