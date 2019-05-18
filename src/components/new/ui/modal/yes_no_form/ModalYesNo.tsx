import * as React from 'react';
import EtsBootstrap from '../../@bootstrap';

type ModalYesNo = {
  show: boolean;
  handleHide: () => any;
  handleSubmit: (e: any) => any;

  title?: string;
  message: string;
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
          <div>
            <EtsBootstrap.Button onClick={props.handleSubmit}>Ок</EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={props.handleHide}>Отмена</EtsBootstrap.Button>
          </div>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default ModalYesNo;
