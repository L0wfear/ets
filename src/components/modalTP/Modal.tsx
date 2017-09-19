import * as React from 'react';
import {
  Modal as Modals,
} from 'react-bootstrap';

export interface IPropsModal {
  show: boolean;
  Text: any;
  title: string;
  onHide: any;
}

const Modal: React.SFC<IPropsModal> = props  => {
  const { Text } = props;

  return (
    <Modals show={props.show} onHide={props.onHide}>
      <Modals.Header closeButton>
        <Modals.Title>{props.title}</Modals.Title>
      </Modals.Header>
      <Modals.Body>
        {Text}
      </Modals.Body>
    </Modals>
  );
};

export default Modal;
