import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';

import LoadingOverlay from 'components/ui/LoadingOverlay';

export default props => (
  <Modal.Body {...props}>
    <LoadingOverlay />
    {props.children}
  </Modal.Body>
);
