import * as React from 'react';
import { Button } from 'react-bootstrap';
import useFormData from 'components/new/utils/context/form/useFormData';
import { connect, DispatchProp } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

type ButtonSaveFormStateProps = void;
type ButtonSaveFormDispatchProps = DispatchProp;
type ButtonSaveFormStateOwnProps = {
  formDataKey: string;
};

type ButtonSaveFormProps = (
  ButtonSaveFormStateProps
  & ButtonSaveFormDispatchProps
  & ButtonSaveFormStateOwnProps
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

export default connect<ButtonSaveFormStateProps, ButtonSaveFormDispatchProps, ButtonSaveFormStateOwnProps, ReduxState>(
  null,
)(ButtonSaveForm);
