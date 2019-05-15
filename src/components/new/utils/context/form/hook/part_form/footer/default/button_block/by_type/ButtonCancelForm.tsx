import * as React from 'react';
import { Button } from 'react-bootstrap';
import useFormData from 'components/new/utils/context/form/hoc_selectors/useForm';

type ButtonCancelFormProps = {
  formDataKey: string;
};

const ButtonCancelForm: React.FC<ButtonCancelFormProps> = React.memo(
  (props) => {
    const handleHide = useFormData.useFormDataSchemaHandleHide(props.formDataKey);

    return (
      <Button onClick={handleHide}>Отменить</Button>
    );
  },
);

export default ButtonCancelForm;
