import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import { Modal } from 'react-bootstrap';
import { DefaultHeaderType } from 'components/new/utils/context/@types';

type WaybillHeaderProps = {
  formDataKey: string;
};

const WaybillHeader: React.FC<WaybillHeaderProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaHeader<any>(props.formDataKey) as DefaultHeaderType;
    const IS_CREATING = useForm.useFormDataSchemaIsCreating<any>(props.formDataKey);

    const title = React.useMemo(
      () => {
        return 'hello';
      },
      [formDataHeaderValue.title, IS_CREATING],
    );

    return React.useMemo(
      () => (
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
      ),
      [title],
    );
  },
);

export default WaybillHeader;
