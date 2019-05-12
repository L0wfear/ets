import * as React from 'react';
import { Button } from 'react-bootstrap';
import useFormData from 'components/new/utils/context/form/useFormData';

type ButtonSaveFormProps = {
  formDataKey: string;
};

const ButtonSaveForm: React.FC<ButtonSaveFormProps> = React.memo(
  (props) => {
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);

    const handleSubmit = React.useCallback(
      () => console.log('submit'), /* tslint:disable-line */
      [],
    );

    return React.useMemo(
      () => (
        <Button disabled={!canSave} onClick={handleSubmit}>Сохранить</Button>
      ),
      [canSave, handleSubmit],
    );
  },
);

export default ButtonSaveForm;
