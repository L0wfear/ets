import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';

import config from 'config';
import ModalForm from 'components/modalTP/Modal';

interface IPropsModalTP {
  onHide: any;
  show: boolean;
}
const Header: React.FunctionComponent<any> = (props) =>
  <Modal.Header closeButton>
    <Modal.Title>Техническая поддержка</Modal.Title>
  </Modal.Header>;

const Body: React.FunctionComponent<any> = (props) =>
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

const ModalTP: React.FunctionComponent<IPropsModalTP> = (props) => {
  return (
    <ModalForm
      dialogClassName="custom-modalTP"
      onHide={props.onHide}
      show={props.show}
      Header={<Header/>}
      Body={<Body/>}
    />
  );
};

export default ModalTP;
