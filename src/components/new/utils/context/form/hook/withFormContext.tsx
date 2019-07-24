import * as React from 'react';
import { get } from 'lodash';

import FormContext, { ConfigFormData } from '../FormContext';
import ModalFormHeader from './part_form/header/ModalFormHeader';
import ModalFormFooter from './part_form/footer/ModalFormFooter';
import ModalFormBody from './part_form/body/ModalFormBody';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { useDispatch } from 'react-redux';
import useForm from '../hook_selectors/useForm';

type FormProps<P> = P;

// Дефолтные пропсы в создаваемом компоненте
export type DefaultPropsWithFormContext<T extends any> = {
  element: Partial<T>,                                                    // изменяемый элемент
  handleHide: (isSumbitted: boolean | any, result?: Partial<T>) => void;  // закрытие формы | isSumbitted - было ли сохранение, result - результат сохранения

  page: string;                                                           // для отображения загрузки, временно как пропс (нужно брать из урла)
  path?: string;                                                          // для отображения загрузки (вторая часть)
};

const withFormContext = <T extends any, InnerProps extends DefaultPropsWithFormContext<T>, Store extends Record<string, any>>(formData: ConfigFormData<T, Store>) => {
  const Form: React.FC<FormProps<InnerProps>> = React.memo(
    (props) => {
      const context = React.useContext(FormContext);
      const dispatch = useDispatch();

      React.useEffect(
        () => {
          const addFormData = async () => {
            const uniqField =  get(formData, 'uniqField', 'id');
            const IS_CREATING = !Boolean(get(
              props.element,
              uniqField,
              false,
            ));

            let element = props.element;

            if (!IS_CREATING && formData.loadItemPromise) {
              try {
                element = await etsLoadingCounter(
                  dispatch,
                  formData.loadItemPromise(element[uniqField]),
                  {
                    page: props.page,
                    path: props.path,
                  },
                );
              } catch (e) {
                global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
                props.handleHide(false);
                return;
              }
            }

            const store = formData.store || {} as Store;

            context.addFormData<T, Store>(
              {
                ...formData,                                        // что пришло из конфига
                handleHide: (isSubmitted, result) => {              // обёртка закрытия формы
                  context.removeFormData<T, Store>(formData.key);
                  props.handleHide(isSubmitted, result);
                },
                handleChange: (objChange) => {                      // обёртка изменения формы
                  context.handleChangeFormState<T, Store>(
                    formData.key,
                    objChange,
                  );
                },
                page: props.page,
                path: props.path,
                uniqField,
                IS_CREATING,
                store,
              },
              element,                                            // новый элемент
            );
          };

          addFormData();
        },
        [],
      );

      const handleHide = useForm.useFormDataSchemaHandleHide(formData.key);

      return React.useMemo(
        () => {
          return handleHide && (
            <EtsBootstrap.ModalContainer id={`modal-${formData.key}}`} show onHide={handleHide} bsSize={formData.bsSizeForm}>
              <ModalFormHeader formDataKey={formData.key} />
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
