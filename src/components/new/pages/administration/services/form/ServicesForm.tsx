import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
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
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.handleHide} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>История изменений сервисов</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <ServicesHistoryList service_id={props.element.id} service_name={props.element.name}/>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={props.handleHide}>Закрыть</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default ServicesForm;
