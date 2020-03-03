import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useFormData from 'components/@next/@form/hook_selectors/useForm';

type Props = {
  formDataKey: FormKeys;
  handleHide: any;
};

const ModalHeaderDefault: React.FC<Props> = React.memo(
  (props) => {
    const title = useFormData.useFormDataTitle(props.formDataKey);

    return (
      <EtsBootstrap.ModalHeader closeButton onHide={props.handleHide}>
        <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
    );
  },
);

export default ModalHeaderDefault;
