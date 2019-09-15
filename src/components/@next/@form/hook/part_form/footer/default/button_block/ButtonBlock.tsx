import * as React from 'react';
import ButtonSaveForm from './by_type/ButtonSaveForm';
import ButtonCancelForm from './by_type/ButtonCancelForm';
import { DefautlFooterButtons } from 'components/@next/@form/@types';

type ButtonBlockProps = {
  formDataKey: string;
  blockButtons: ValuesOf<DefautlFooterButtons['buttons']>
};

const ComponentsByKey: Record<ValuesOf<ValuesOf<DefautlFooterButtons['buttons']>>, React.ComponentType<Pick<ButtonBlockProps, 'formDataKey'>>> = {
  save: ButtonSaveForm,
  cancel: ButtonCancelForm,
};

const ButtonBlock: React.FC<ButtonBlockProps> = React.memo(
  (props) => {
    return (
      <React.Fragment>
        {
          props.blockButtons.map((buttonType) => {
            const ComponentName = ComponentsByKey[buttonType];

            if (ComponentName) {
              return (
                <ComponentName key={buttonType} formDataKey={props.formDataKey} />
              );
            }

            return (
              <div>{`Опередели тип кнопки для ${buttonType} в ButtonBlock ComponentsByKey`}</div>
            );
          })
        }
      </React.Fragment>
    );
  },
);

export default ButtonBlock;
