import * as React from 'react';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldsRows from './fields_rows/FieldsRows';

type ModalFormBodyProps = {
  formDataKey: string;
};

const ModalFormBody: React.FC<ModalFormBodyProps> = React.memo(
  (props) => {
    const page = useForm.useFormDataSchemaPage(props.formDataKey);
    const path = useForm.useFormDataSchemaPath(props.formDataKey);

    return React.useMemo(
      () => (
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FieldsRows formDataKey={props.formDataKey} />
        </ModalBodyPreloader>
      ),
      [page, path, props],
    );
  },
);

export default ModalFormBody;
