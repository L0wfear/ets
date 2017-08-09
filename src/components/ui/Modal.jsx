import React from 'react';
import { Modal } from 'react-bootstrap';

import LoadingOverlay from 'components/ui/LoadingOverlay';

export default props => (
  <Modal.Body {...props}>
    <LoadingOverlay />
    {props.children}
  </Modal.Body>
);
