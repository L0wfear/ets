import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';

import ButtonBlock from './button_block/ButtonBlock';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type DefaultModalFooterProps = {
  formDataKey: string;
};

const DefaultModalFooter: React.FC<DefaultModalFooterProps> = React.memo(
  (props) => {
    const formDataFooterValue = useForm.useFormDataSchemaFooter(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.ModalFooter>
            {
              formDataFooterValue.buttons.map((_: any, index) => (
                <ButtonBlock key={index + 1} indexBlock={index} formDataKey={props.formDataKey} />
              ))
            }
          </EtsBootstrap.ModalFooter>
        );
      },
      [formDataFooterValue.buttons, props.formDataKey],
    );
  },
);

export default DefaultModalFooter;
