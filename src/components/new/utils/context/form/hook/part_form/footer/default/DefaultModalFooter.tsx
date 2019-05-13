import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import { Modal } from 'react-bootstrap';
import ButtonBlock from './button_block/ButtonBlock';

type DefaultModalFooterProps = {
  formDataKey: string;
};

const DefaultModalFooter: React.FC<DefaultModalFooterProps> = React.memo(
  (props) => {
    const formDataFooterValue = useForm.useFormDataSchemaFooter(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <Modal.Footer>
            {
              formDataFooterValue.buttons.map((_: any, index) => (
                <ButtonBlock key={index + 1} indexBlock={index} formDataKey={props.formDataKey} />
              ))
            }
          </Modal.Footer>
        );
      },
      [formDataFooterValue.buttons, props.formDataKey],
    );
  },
);

export default DefaultModalFooter;
