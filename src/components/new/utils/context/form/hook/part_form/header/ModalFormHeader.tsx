import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import DefaultModalHeader from './default/DefaultHeader';

type ModalFormHeaderProps = {
  formDataKey: string;
};

const ModalFormHeader: React.FC<ModalFormHeaderProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaHeader(props.formDataKey);

    if (!formDataHeaderValue.type || formDataHeaderValue.type) {
      return (
        <DefaultModalHeader formDataKey={props.formDataKey} />
      );
    }
    return <div>{`Определи тип шапки для ${formDataHeaderValue.type}`}</div>;
  },
);

export default ModalFormHeader;
