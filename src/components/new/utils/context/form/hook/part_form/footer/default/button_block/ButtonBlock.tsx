import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import ButtonSaveForm from './by_type/ButtonSaveForm';
import ButtonCancelForm from './by_type/ButtonCancelForm';

type ButtonBlockProps = {
  formDataKey: string;
  indexBlock: number
};

const ButtonBlock: React.FC<ButtonBlockProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaFooter(props.formDataKey);
    const buttonsBlockData = formDataHeaderValue.buttons[props.indexBlock];

    const buttons = React.useMemo(
      () => {
        return buttonsBlockData.map((buttonType) => {
          if (buttonType === 'save') {
            return (
              <ButtonSaveForm key={buttonType} formDataKey={props.formDataKey} />
            );
          }
          if (buttonType === 'cancel') {
            return (
              <ButtonCancelForm key={buttonType} formDataKey={props.formDataKey} />
            );
          }

          return (
            <div>{`Опередели тип кнопки для ${buttonType} в ButtonBlock`}</div>
          );
        });
      },
      [buttonsBlockData, props.formDataKey],
    );

    return (
      <div>
        { buttons }
      </div>
    );
  },
);

export default ButtonBlock;
