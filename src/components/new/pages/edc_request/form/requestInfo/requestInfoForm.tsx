import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { get } from 'lodash';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { createValidDateHM } from 'utils/dates';
import RequestHistoryList from 'components/new/pages/edc_request/form/requestInfo/RequestHistoryList';

type RequestInfoFormOwnProps = {
  handleHide: (isSubmitted: boolean | any, result?: any) => any;
  element: EdcRequest;

  page: string;
  path?: string;
};

type RequestInfoFormProps = (
  RequestInfoFormOwnProps
);

const RequestInfoForm: React.FC<RequestInfoFormProps> = React.memo(
  (props) => {

    const request_number = get(props, 'element.request_number', '');
    const create_date = createValidDateHM(get(props, 'element.create_date', null));
    const house_address = get(props, 'element.house_address', null);
    const titleModal = `Заявка № ${request_number} была возвращена на доработку ${create_date}`;

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.handleHide} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{titleModal}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <h4>
            Адрес: { house_address ? house_address : '-'}
          </h4>
          <RequestHistoryList
            requestElement = {props.element}
            page = {props.page}
            path = {props.path}
          ></RequestHistoryList>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={props.handleHide}>Закрыть</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default RequestInfoForm;
