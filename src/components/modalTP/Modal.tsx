import * as React from 'react';
import {
  Modal as Modals,
} from 'react-bootstrap';

export interface IPropsModal {
  show?: boolean;
  Text: object;
  title: string;
  dialogClassName: string;
  onHide: any;
}

const Modal: React.SFC<IPropsModal> = props  => {
  const {
    dialogClassName = '',
    title,
    Text,
    show,
  } = props;

  return (
    <Modals show={show} onHide={props.onHide} dialogClassName={dialogClassName}>
      <Modals.Header closeButton>
        <Modals.Title>{title}</Modals.Title>
      </Modals.Header>
      <Modals.Body>
        {Text}
      </Modals.Body>
    </Modals>
  );
};

export default Modal;
