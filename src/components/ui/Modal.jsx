import React from 'react';
import LoadingOverlay from 'components/ui/LoadingOverlay.jsx';
import { Modal } from 'react-bootstrap';

export default props => (
  <Modal.Body {...props}>
    <LoadingOverlay />
    {props.children}
  </Modal.Body>
);
