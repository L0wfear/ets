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
      <p>Уважаемые пользователи!</p>
      <label>
        <p>Уведомляем, что с 1 Ноября 2017 года Система переходит на зимний период. В связи с этим список технологических операций обновлён в соответствии с сезоном.</p>
        <p>Просим обратить на это внимание при формировании заданий.</p>
      </label>
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
