import * as React from 'react';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldsRows from './fields_rows/FieldsRows';

type ModalFormBodyProps = {
  formDataKey: string;
};

const ModalFormBody: React.FC<ModalFormBodyProps> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta(props.formDataKey);

    return (
      <ModalBodyPreloader page={meta.page} path={meta.path} typePreloader="mainpage">
        <FieldsRows formDataKey={props.formDataKey} />
      </ModalBodyPreloader>
    );
  },
);

export default ModalFormBody;
