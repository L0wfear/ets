import * as React from 'react';
import {
  Modal as Modals,
} from 'react-bootstrap';

export interface IPropsModal {
  show: boolean;
  dialogClassName: string;
  onHide: any;
  Header?: any;
  Body?: any;
  Footer?: any;
}

const Modal: React.SFC<IPropsModal> = props  => {
  const {
    dialogClassName = '',
    show,
    Header,
    Body,
    Footer,
  } = props;

  return (
    <Modals show={show} onHide={props.onHide} dialogClassName={dialogClassName}>
      {Header}
      {Body}
      {Footer}
    </Modals>
  );
};

export default Modal;
