import * as React from 'react';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import ButtonBlock from './button_block/ButtonBlock';
import { DefautlFooterButtons } from 'components/@next/@form/@types';

type DefaultModalFooterProps = {
  formDataKey: string;
};

const DefaultModalFooter: React.FC<DefaultModalFooterProps> = React.memo(
  (props) => {
    const formDataFooterValue = useForm.useFormDataSchemaFooter<any>(props.formDataKey) as DefautlFooterButtons;

    return React.useMemo(
      () => {
        return (
          <React.Fragment>
            {
              formDataFooterValue.buttons.map((blockButtons: any, index) => (
                <ButtonBlock key={index + 1} blockButtons={blockButtons} formDataKey={props.formDataKey} />
              ))
            }
          </React.Fragment>
        );
      },
      [formDataFooterValue.buttons, props],
    );
  },
);

export default DefaultModalFooter;
