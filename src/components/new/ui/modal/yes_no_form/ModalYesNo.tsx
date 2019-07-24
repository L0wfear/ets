import * as React from 'react';
import EtsBootstrap from '../../@bootstrap';

type ModalYesNo = {
  show: boolean;
  handleHide: () => any;
  handleSubmit: (e: any) => any;

  title?: string;
  message: string;

  titleOk?: string;
  titleCancel?: string;
};

const ModalYesNo: React.FC<ModalYesNo> = React.memo(
  (props) => {
    const title = props.title || 'Внимание!';

    return (
      <EtsBootstrap.ModalContainer
        show={props.show}
        bsSize="small"
        id="delete-form"
        onHide={props.handleHide}
      >
        <EtsBootstrap.ModalHeader>{title}</EtsBootstrap.ModalHeader>
        <EtsBootstrap.ModalBody>
          <span>
            {props.message}
          </span>
        </EtsBootstrap.ModalBody>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={props.handleSubmit}>{props.titleOk || 'Ок'}</EtsBootstrap.Button>
          <EtsBootstrap.Button onClick={props.handleHide}>{props.titleCancel || 'Отмена'}</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default ModalYesNo;
