import * as React from 'react';
import * as ModalRb from 'react-bootstrap/lib/Modal';

export interface IPropsModal {
  show: boolean;
  dialogClassName: string;
  onHide: any;
  Header?: any;
  Body?: any;
  Footer?: any;
}

const Modal: React.SFC<IPropsModal> = (props) => {
  const {
    dialogClassName = '',
    show,
    Header,
    Body,
    Footer,
  } = props;

  return (
    <ModalRb show={show} onHide={props.onHide} dialogClassName={dialogClassName}>
      {Header}
      {Body}
      {Footer}
    </ModalRb>
  );
};

export default Modal;
