import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import ServicesHistoryList from './service_history/ServicesHistoryList';
import { Service } from 'redux-main/reducers/modules/services/@types/services';

type ServicesFormOwnProps = {
  handleHide: (isSubmitted: boolean | any, result?: any) => any;
  element: Service;

  page: string;
  path?: string;
};

const ServicesForm: React.FC<ServicesFormOwnProps> = React.memo(
  (props) => {
    return (
      <Modal id="modal-spare-part" show onHide={props.handleHide} backdrop="static" bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>История изменений сервисов</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <ServicesHistoryList service_id={props.element.id} service_name={props.element.name}/>
        </ModalBodyPreloader>
        <Modal.Footer>
          <Button onClick={props.handleHide}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    );
  },
);

export default ServicesForm;
