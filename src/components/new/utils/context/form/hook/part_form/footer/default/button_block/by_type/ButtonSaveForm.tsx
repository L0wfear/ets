import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Button } from 'react-bootstrap';

import useFormData from 'components/new/utils/context/form/useFormData';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { ReduxState } from 'redux-main/@types/state';

type StateProps = {};
type OwnProps = {
  formDataKey: string;
};

type ButtonSaveFormProps = (
  StateProps
  & DispatchProp
  & OwnProps
);

const ButtonSaveForm: React.FC<ButtonSaveFormProps> = React.memo(
  (props) => {
    const isPermitted = useFormData.useFormDataIsPermitted(props.formDataKey);
    const formState = useFormData.useFormDataFormState<any>(props.formDataKey);
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);
    const handleSubmitPromise = useFormData.useFormDataHandleSubmitAction<any>(props.formDataKey);
    const handleHide = useFormData.useFormDataSchemaHandleHide<any>(props.formDataKey);
    const page = useFormData.useFormDataSchemaPage(props.formDataKey);
    const path = useFormData.useFormDataSchemaPath(props.formDataKey);

    const handleSubmit = React.useCallback(
      async () => {
        let response = null;
        try {
          response = await etsLoadingCounter(
            props.dispatch,
            handleSubmitPromise(formState),
            { page, path },
          );
        } catch (error) {
          //
        }

        handleHide(true, response);
      },
      [props.dispatch, handleHide, handleSubmitPromise, formState, page, path],
    );

    return React.useMemo(
      () => (
        isPermitted
         && (
            <Button disabled={!canSave} onClick={handleSubmit}>Сохранить</Button>
          )
      ),
      [canSave, handleSubmit, isPermitted],
    );
  },
);

export default connect<StateProps, DispatchProp, OwnProps, ReduxState>(
  null,
)(ButtonSaveForm);
