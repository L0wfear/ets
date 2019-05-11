import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import DefaultModalFooter from './default/DefaultModalFooter';

type ModalFormFooterProps = {
  formDataKey: string;
};

const ModalFormFooter: React.FC<ModalFormFooterProps> = React.memo(
  (props) => {
    const formDataFooterValue = useForm.useFormDataSchemaFooter(props.formDataKey);

    if (!formDataFooterValue.type || formDataFooterValue.type) {
      return (
        <DefaultModalFooter formDataKey={props.formDataKey} />
      );
    }
    return <div>{`Определи тип футера для ${formDataFooterValue.type}`}</div>;
  },
);

export default ModalFormFooter;
