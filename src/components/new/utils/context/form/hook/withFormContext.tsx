import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';
import FormContext, { ConfigFormData } from '../FormContext';
import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { validatePermissions } from 'components/util/RequirePermissionsNewRedux';

type FormStateProps = {
  permissionsSet: InitialStateSession['userData']['permissionsSet'];
};
type FormDispatchProps = DispatchProp;
type FormOwnProps<P> = P;

type FormProps<P> = (
  FormStateProps
  & FormDispatchProps
  & FormOwnProps<P>
);

export type DefaultPropsWithFormContext<T extends any> = {
  element: Partial<T>,
  handleHide: (isSumbitted: boolean, result?: Partial<T>) => void;

  page: string;
  path?: string;
};

const withFormContext = <T extends any, InnerProps extends DefaultPropsWithFormContext<T>>(formData: ConfigFormData<T>) => {
  const Form: React.FC<FormProps<InnerProps>> = (props) => {
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
            isPermittedToCreate: validatePermissions(formData.permissions.create, props.permissionsSet),
            isPermittedToUpdate: false && validatePermissions(formData.permissions.update, props.permissionsSet),
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
  };

  return connect<FormStateProps, FormDispatchProps, FormOwnProps<InnerProps>, ReduxState>(
    (state) => ({
      permissionsSet: state.session.userData.permissionsSet,
    }),
  )(Form as any);
};

export default withFormContext;
