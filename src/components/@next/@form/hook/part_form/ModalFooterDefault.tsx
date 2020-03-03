import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import useFormData from 'components/@next/@form/hook_selectors/useForm';

type Props = {
  formDataKey: FormKeys;
  handleHide: any;
};

const ModalFooterDefault: React.FC<Props> = React.memo(
  (props) => {
    const isPermitted = useFormData.useFormDataIsPermitted(props.formDataKey);
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);
    const handleSubmitPromise = useFormData.useFormDataHandleSubmitPromise<any>(props.formDataKey);

    const dispatch = etsUseDispatch();

    const handleSubmit = React.useCallback(
      async () => {
        if (canSave) {
          let response = null;
          try {
            response = await handleSubmitPromise();
          } catch (error) {
            return;
          }
          props.handleHide(true, response);
        }
      },
      [dispatch, canSave, props.handleHide, handleSubmitPromise],
    );

    return (
      <EtsBootstrap.ModalFooter>
        {
          isPermitted && (
            <EtsBootstrap.Button disabled={!canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
          )
        }
        <EtsBootstrap.Button onClick={props.handleHide}>Отменить</EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    );
  },
);

export default ModalFooterDefault;
