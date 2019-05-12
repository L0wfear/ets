import * as React from 'react';
import FormContext, { OneFormDataByKey } from '../FormContext';
import { Modal } from 'react-bootstrap';
import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';

export type DefaultPropsWithFormContext<T = any> = {
  element: Partial<T>,
  handleHide: (isSumbitted: boolean, result?: Partial<T>) => void;

  page: string;
  path?: string;
};

type ConfigFormData<T = any> = {
  key: OneFormDataByKey<T>['key'];
  mergeElement: OneFormDataByKey<T>['mergeElement'];
  schema: OneFormDataByKey<T>['schema'];
  uniqField?: OneFormDataByKey<T>['uniqField'];
  permissions: OneFormDataByKey<T>['permissions'];
};

const withFormContext = <T extends any, InnerProps extends DefaultPropsWithFormContext<T>>(formData: ConfigFormData): React.FC<InnerProps> => React.memo(
  (props) => {
    const context = React.useContext(FormContext);

    React.useEffect(
      () => {
        context.addFormData<any>(
          {
            ...formData,
            handleHide: (isSubmitted, result) => {
              context.removeFormData<any>(formData.key);
              props.handleHide(isSubmitted, result);
            },
            handleChange: (objChange) => {
              context.handleChangeFormState<any>(
                formData.key,
                objChange,
              );
            },
          },
          props.element,
        );
        return () => context.removeFormData<any>(formData.key);
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
