import * as React from 'react';
import useFormData from 'components/new/utils/context/form/useFormData';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ButtonCancelFormProps = {
  formDataKey: string;
};

const ButtonCancelForm: React.FC<ButtonCancelFormProps> = React.memo(
  (props) => {
    const handleHide = useFormData.useFormDataSchemaHandleHide(props.formDataKey);

    return (
      <EtsBootstrap.Button onClick={handleHide}>Отменить</EtsBootstrap.Button>
    );
  },
);

export default ButtonCancelForm;
