import * as React from 'react';

import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from '../hook_selectors/useForm';

type OwnProps = {
  formDataKey: string;
};

const FormContext: React.FC<OwnProps> = React.memo(
  (props) => {
    const {
      formDataKey,
    } = props;

    const handleHide = useForm.useFormDataSchemaHandleHide(formDataKey);
    const bsSizeForm = useForm.useFormDataBsSizeForm(formDataKey);

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={handleHide} bsSize={bsSizeForm}>
        <ModalFormHeader formDataKey={formDataKey} onHide={handleHide} />
        <ModalFormBody formDataKey={formDataKey} />
        <ModalFormFooter formDataKey={formDataKey} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default FormContext;
