import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

import ModalForm from './Modal';

interface IPropsModalTP {
  onHide: any;
  show: boolean;
}

const Body =
  <Modal.Body>
    <div>
      <label>Уважаемые пользователи!</label>
      <p>Информируем о начале работы службы Технической поддержки ЕТС</p>
      <p>Если Вам требуется обратиться в Службу Технической поддержки, Вы можете сделать это следующим образом:</p>
      <ol>
        <li><span>Обратившись в службу Технической поддержки по телефону: </span><a href="tel:84951501193">8(495) 150-11-93</a>
        </li>
        <li><span>Написав письмо по электронной почте: </span><a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
        </li>
      </ol>
    </div>
  </Modal.Body>;

const Footer: React.SFC<any> = props =>
  <Modal.Footer>
    <Button onClick={props.onHide}>Ознакомлен</Button>
  </Modal.Footer>;

const ModalTP: React.SFC<IPropsModalTP> = props  => {
  const FooterWithProps = <Footer onHide={props.onHide} />;
  return (
    <ModalForm
      dialogClassName=""
      onHide={undefined}
      show={props.show}
      Footer={FooterWithProps}
      Body={Body}
    />
  );
};

export default ModalTP;
