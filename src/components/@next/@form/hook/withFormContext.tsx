import * as React from 'react';

import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from '../hook_selectors/useForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionInitialForm, OneFormDataByKeyForAdd } from 'redux-main/reducers/modules/form_data_record/actions';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const withFormContext = <OwnProps extends LoadingMeta, F extends Record<string, any>, Store extends object>(funcCreateFormData: (props: OwnProps) => OneFormDataByKeyForAdd<F, Store>) => {
  const Form: React.FC<OwnProps> = React.memo(
    (props) => {
      const dispatch = etsUseDispatch();

      const formData = React.useMemo(
        () => {
          return funcCreateFormData(props);
        },
        [props],
      );

      React.useEffect(
        () => {
          dispatch(
            actionInitialForm(
              formData,
              props.element,
              props,
            ),
          );
        },
        [formData],
      );

      const handleHide = useForm.useFormDataSchemaHandleHide(formData.key);

      return React.useMemo(
        () => {
          return handleHide && (
            <EtsBootstrap.ModalContainer id={`modal-${formData.key}}`} show onHide={handleHide} bsSize={formData.bsSizeForm}>
              <ModalFormHeader formDataKey={formData.key} onHide={handleHide} />
              <ModalFormBody formDataKey={formData.key} />
              <ModalFormFooter formDataKey={formData.key} />
            </EtsBootstrap.ModalContainer>
          );
        },
        [handleHide], // так проще, тк formData меняется, но это изменение здесь не нужно
      );
    },
  );

  return Form;
};

export default withFormContext;
