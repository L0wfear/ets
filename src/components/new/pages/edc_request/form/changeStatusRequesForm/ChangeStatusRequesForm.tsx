import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { get } from 'lodash';
import { createValidDateHM } from 'utils/dates';
import { ChangeStatusRequesFormLazyOwnProps } from 'components/new/pages/edc_request/form/changeStatusRequesForm/index';

type ChangeStatusRequesFormOwnProps = {
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
  checkedRows: ChangeStatusRequesFormLazyOwnProps['checkedRows'];

  page: string;
  path?: string;
};

type ChangeStatusRequesFormProps = (
  ChangeStatusRequesFormOwnProps
);

const ChangeStatusRequesForm: React.FC<ChangeStatusRequesFormProps> = React.memo(
  (props) => {

    const request_number = get(props, 'element.request_number', '');
    const create_date = createValidDateHM(get(props, 'element.create_date', null));
    const titleModal = `Заявка № ${request_number} была возвращена на доработку ${create_date}`;

    return (
      <EtsBootstrap.ModalContainer id="modal-spare-part" show onHide={props.onFormHide} backdrop="static" bsSize="medium">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{titleModal}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={props.page} path={props.path} typePreloader="mainpage">
          <h4>
            Адрес:
          </h4>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button onClick={props.onFormHide}>Закрыть</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default ChangeStatusRequesForm;
