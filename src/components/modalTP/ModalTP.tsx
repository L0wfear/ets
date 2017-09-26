import * as React from 'react';
import { Modal } from 'react-bootstrap';

import config from 'config';
import ModalForm from './Modal';

interface IPropsModalTP {
  onHide: any;
  show: boolean;
}
const Header: React.SFC<any> = props =>
  <Modal.Header closeButton>
    <Modal.Title>Техническая поддержка</Modal.Title>
  </Modal.Header>;

const Body: React.SFC<any> = props =>
  <Modal.Body>
    <div>
      <div>
        <label>
        <span>Обратиться в службу технической поддержки можно по электронной почте </span>
        <a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
        <span> или по телефону: </span>
        <a href="tel:84951501193">8(495) 150-11-93</a>
        </label>
      </div>
      <label><a href={`${config.docs}Общие_рекомендации_по_обращению.docx`}>Общие рекомендации по обращению</a></label>

    </div>
  </Modal.Body>;

const ModalTP: React.SFC<IPropsModalTP> = props  => {
  const HeaderWithProps = (
    <Header
    />
  );
  const BodyWithProps = (
    <Body
    />
  );
  return (
    <ModalForm
      dialogClassName="custom-modalTP"
      onHide={props.onHide}
      show={props.show}
      Header={HeaderWithProps}
      Body={BodyWithProps}
    />
  );
};

export default ModalTP;
