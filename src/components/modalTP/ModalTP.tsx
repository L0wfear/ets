import * as React from 'react';
import ModalForm from './Modal';

interface IPropsModalTP {
  onHide: any;
  show: boolean;
}

const Text =
  <label>
    <span>Обратиться в службу технической поддержки можно по электронной почте </span>
    <a href="mailto:ETS_support@mos.ru">ETS_support@mos.ru</a>
    <span> или по телефону: </span>
    <a href="tel:84951501193">8(495) 150-11-93</ a>
  </label>;

const ModalTP: React.SFC<IPropsModalTP> = props  =>
  <ModalForm
    dialogClassName="custom-modalTP"
    title="Техническая поддержка"
    Text={Text}
    onHide={props.onHide}
    show={props.show}
  />;

export default ModalTP;
