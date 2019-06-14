import * as React from 'react';
import { useDispatch } from 'react-redux';

import useFormData from 'components/new/utils/context/form/hook_selectors/useForm';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type ButtonSaveFormProps = {
  formDataKey: string;
};

const ButtonSaveForm: React.FC<ButtonSaveFormProps> = React.memo(
  (props) => {
    const isPermitted = useFormData.useFormDataIsPermitted(props.formDataKey);
    const formState = useFormData.useFormDataFormState<any>(props.formDataKey);
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);
    const handleSubmitPromise = useFormData.useFormDataHandleSubmitAction<any>(props.formDataKey);
    const handleHide = useFormData.useFormDataSchemaHandleHide<any>(props.formDataKey);
    const page = useFormData.useFormDataSchemaPage(props.formDataKey);
    const path = useFormData.useFormDataSchemaPath(props.formDataKey);

    const dispatch = useDispatch();

    const handleSubmit = React.useCallback(
      async () => {
        let response = null;
        try {
          response = await etsLoadingCounter(
            dispatch,
            handleSubmitPromise(formState),
            { page, path },
          );
        } catch (error) {
          //
        }

        handleHide(true, response);
      },
      [dispatch, handleHide, handleSubmitPromise, formState, page, path],
    );

    return React.useMemo(
      () => (
        isPermitted
         && (
            <EtsBootstrap.Button disabled={!canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
          )
      ),
      [canSave, handleSubmit, isPermitted],
    );
  },
);

export default ButtonSaveForm;
