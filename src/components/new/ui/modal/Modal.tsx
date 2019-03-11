import * as React from 'react';
import * as BootstrapModal from 'react-bootstrap/lib/Modal';

const EtsModal: React.FunctionComponent<
  BootstrapModal.ModalProps
> = (props) => {
  return (
    <BootstrapModal
      {...props}
    />
  );
};

export default EtsModal;
