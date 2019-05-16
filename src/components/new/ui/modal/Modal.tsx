import * as React from 'react';
import * as BootstrapModal from 'react-bootstrap/lib/Modal';

const EtsModal: React.FC<
  BootstrapModal.ModalProps
> = (props) => {
  const handleDoubleClick = React.useCallback(
    (event) => {
      event.stopPropagation();
    },
    [],
  );
  return (
    <BootstrapModal  {...props}>
      <div onDoubleClick={handleDoubleClick}>
        {props.children}
      </div>
    </BootstrapModal>
  );
};

export default EtsModal;
