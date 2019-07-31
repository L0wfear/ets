import React from 'react';

import LoadingOverlay from 'components/ui/LoadingOverlay';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export default (props) => (
  <EtsBootstrap.ModalBody {...props}>
    <LoadingOverlay />
    {props.children}
  </EtsBootstrap.ModalBody>
);
