import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldsRows from './fields_rows/FieldsRows';

type ModalFormBodyProps = {
  formDataKey: string;
};

const ModalFormBody: React.FC<ModalFormBodyProps> = React.memo(
  (props) => {
    const page = useForm.useFormDataSchemaPage(props.formDataKey);
    const path = useForm.useFormDataSchemaPath(props.formDataKey);

    return (
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <FieldsRows formDataKey={props.formDataKey} />
      </ModalBodyPreloader>
    );
  },
);

export default ModalFormBody;
