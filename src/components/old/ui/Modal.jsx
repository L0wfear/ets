import React from 'react';

import LoadingOverlay from 'components/old/ui/LoadingOverlay';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const ModalBody = (props) => (
  <EtsBootstrap.ModalBody {...props}>
    <LoadingOverlay />
    {props.children}
  </EtsBootstrap.ModalBody>
);

export default ModalBody;
