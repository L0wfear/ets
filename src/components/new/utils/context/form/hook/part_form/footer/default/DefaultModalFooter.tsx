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

    const buttonsBlock = React.useMemo(
      () => {
        return (
          formDataFooterValue.buttons.map((_: any, index) => (
            <ButtonBlock key={index + 1} indexBlock={index} formDataKey={props.formDataKey} />
          ))
        );
      },
      [formDataFooterValue.buttons, props.formDataKey],
    );

    return (
      <Modal.Footer>
        { buttonsBlock }
      </Modal.Footer>
    );
  },
);

export default DefaultModalFooter;
