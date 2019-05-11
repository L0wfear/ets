import * as React from 'react';
import FormContext from '../FormContext';
import { Modal } from 'react-bootstrap';
import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';

type DefaultPropsWithFormContext<T = any> = {
  element: Partial<T>,
  handleHide: (isSumbitted: boolean, result?: Partial<T>) => void;

  page: string;
  path?: string;
};

type ConfigFormData = {
  key: string;
  uniqField?: string;
  mergeElement: any;
  schema: any;
  permissions: {
    create: string | string[] | boolean;
    update: string | string[] | boolean;
    [k: string]: any;
  };
};

const withFormContext = <InnerProps extends DefaultPropsWithFormContext>(formData: ConfigFormData) => React.memo<InnerProps>(
  (props) => {
    const context = React.useContext(FormContext);

    React.useEffect(
      () => {
        context.addFormData(
          {
            ...formData,
            handleHide: (isSubmitted, result) => {
              context.removeFormData(formData.key);
              props.handleHide(isSubmitted, result);
            },
            handleChange: (obj) => {
              context.handleChangeFormState(formData.key, obj);
            },
          },
          props.element,
        );
        return () => context.removeFormData(formData.key);
      },
      [],
    );

    return (
      context.formDataByKey[formData.key] &&
        (
          <Modal id={`modal-${formData.key}}`}show onHide={context.formDataByKey[formData.key].handleHide} backdrop="static">
            <ModalFormHeader formDataKey={formData.key} />
            <ModalFormBody formDataKey={formData.key} />
            <ModalFormFooter formDataKey={formData.key} />
          </Modal>
        )
    );
  },
);

export default withFormContext;
