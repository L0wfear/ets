import * as React from 'react';

import useFormData from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type ButtonSaveFormProps = {
  formDataKey: string;
};

const ButtonSaveForm: React.FC<ButtonSaveFormProps> = React.memo(
  (props) => {
    const isPermitted = useFormData.useFormDataIsPermitted(props.formDataKey);
    const formState = useFormData.useFormDataFormState<any>(props.formDataKey);
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);
    const handleSubmitPromise = useFormData.useFormDataHandleSubmitPromise<any>(props.formDataKey);
    const handleHide = useFormData.useFormDataSchemaHandleHide<any>(props.formDataKey);

    const dispatch = etsUseDispatch();

    const handleSubmit = React.useCallback(
      async () => {
        let response = null;
        try {
          response = await handleSubmitPromise(formState);
        } catch (error) {
          //
        }

        handleHide(true, response);
      },
      [dispatch, handleHide, handleSubmitPromise, formState],
    );

    return isPermitted && (
      <EtsBootstrap.Button disabled={!canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
    );
  },
);

export default ButtonSaveForm;
