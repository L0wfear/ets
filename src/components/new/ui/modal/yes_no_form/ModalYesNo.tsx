import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import EtsModal from 'components/new/ui/modal/Modal';

type ModalYesNo = {
  show: boolean;
  handleHide: () => any;
  handleSubmit: () => any;

  title?: string;
  message: string;
};

const ModalYesNo: React.FC<ModalYesNo> = React.memo(
  (props) => {
    const title = props.title || 'Внимание!';

    return (
      <EtsModal
        show={props.show}
        bsSize="small"
        id="delete-form"
        onHide={props.handleHide}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <span>
            {props.message}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={props.handleSubmit}>Ок</Button>
            <Button onClick={props.handleHide}>Отмена</Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    );
  },
);

export default ModalYesNo;
