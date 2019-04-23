import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';

import config from 'config';
import { PropsModalTP } from 'components/new/ui/modal_tp/ModalTP.h';

class ModalTP extends React.PureComponent<PropsModalTP, {}> {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="custom-modalTP">
        <Modal.Header closeButton>
          <Modal.Title>Техническая поддержка</Modal.Title>
        </Modal.Header>
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
        </Modal.Body>
      </Modal>
    );
  }
}

export default ModalTP;
