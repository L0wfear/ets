import * as React from 'react';
import { Button } from 'react-bootstrap';

type ButtonSaveFormProps = {
  formDataKey: string;
};

const ButtonSaveForm: React.FC<ButtonSaveFormProps> = React.memo(
  () => {
    return (
      <Button disabled={false} onClick={() => console.log('submit') /* tslint:disable-line */}>Сохранить</Button>
    );
  },
);

export default ButtonSaveForm;
