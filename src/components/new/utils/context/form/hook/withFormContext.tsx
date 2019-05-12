import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';
import FormContext, { OneFormDataByKey } from '../FormContext';
import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';

export type DefaultPropsWithFormContext<T extends any> = {
  element: Partial<T>,
  handleHide: (isSumbitted: boolean, result?: Partial<T>) => void;

  page: string;
  path?: string;
};

export type ConfigFormData<T extends any> = {
  key: OneFormDataByKey<T>['key'];
  mergeElement: OneFormDataByKey<T>['mergeElement'];
  schema: OneFormDataByKey<T>['schema'];
  uniqField?: OneFormDataByKey<T>['uniqField'];
  permissions: OneFormDataByKey<T>['permissions'];
};

const withFormContext = <T extends any, InnerProps extends DefaultPropsWithFormContext<T>>(formData: ConfigFormData<T>): React.FC<InnerProps> => React.memo(
  (props) => {
    const context = React.useContext(FormContext);

    React.useEffect(
      () => {
        context.addFormData<T>(
          {
            ...formData,
            handleHide: (isSubmitted, result) => {
              context.removeFormData<T>(formData.key);
              props.handleHide(isSubmitted, result);
            },
            handleChange: (objChange) => {
              context.handleChangeFormState<T>(
                formData.key,
                objChange,
              );
            },
          },
          props.element,
        );
        return () => context.removeFormData<T>(formData.key);
      },
      [],
    );

    const handleHide = get(context.formDataByKey[formData.key], 'handleHide', null);

    return React.useMemo(
      () => {
        return handleHide && (
          <Modal id={`modal-${formData.key}}`}show onHide={handleHide} backdrop="static">
            <ModalFormHeader formDataKey={formData.key} />
            <ModalFormBody formDataKey={formData.key} />
            <ModalFormFooter formDataKey={formData.key} />
          </Modal>
        );
      },
      [handleHide],
    );
  },
);

export default withFormContext;
