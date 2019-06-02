import * as React from 'react';

import config from 'config';
import { PropsModalTP } from 'components/new/ui/modal_tp/ModalTP.h';
import EtsBootstrap from '../@bootstrap';

class ModalTP extends React.PureComponent<PropsModalTP, {}> {
  render() {
    return (
      <EtsBootstrap.ModalContainer id="tp" show={this.props.show} onHide={this.props.onHide} position="center">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Техническая поддержка</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <EtsBootstrap.ModalBody>
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
        </EtsBootstrap.ModalBody>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default ModalTP;
