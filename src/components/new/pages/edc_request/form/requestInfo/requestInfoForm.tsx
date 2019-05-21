import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { get } from 'lodash';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';
import { createValidDateHM } from 'utils/dates';

import { promiseGetMission } from 'redux-main/reducers/modules/missions/mission/promise';

type RequestInfoFormOwnProps = {
  handleHide: (isSubmitted: boolean | any, result?: any) => any;
  element: EdcRequest;

  page: string;
  path?: string;
};

const RequestInfoForm: React.FC<RequestInfoFormOwnProps> = React.memo(
  (props) => {
    // console.log('RequestInfoForm props === ', props);

    const request_number = get(props, 'element.request_number', '');
    const request_id = get(props, 'element.id', '');
    const create_date = createValidDateHM(get(props, 'element.create_date', null));
    const house_address = get(props, 'element.house_address', null);
    const titleModal = `Заявка № ${request_number} была возвращена на доработку ${create_date}`;

    React.useEffect( () => {
      try {
        const response = promiseGetMission({request_id});
        // console.log('response === ', response);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      }
    }, []);

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.handleHide} backdrop="static" bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{titleModal}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          {/* <RequestHistoryList service_id={props.element.id} service_name={props.element.name}/> */}
          Адрес: { house_address ? house_address : '-'}
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={props.handleHide}>Закрыть</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default RequestInfoForm;
