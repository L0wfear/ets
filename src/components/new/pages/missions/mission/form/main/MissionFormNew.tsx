import * as React from 'react';

import MissionFormOld from 'components/new/pages/missions/mission/form/main/MissionFormOld';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionUpdateFormErrors } from 'redux-main/reducers/modules/form_data_record/actions';

type Props = {
  formDataKey: 'mission';
  handleHide: (isSubmitted: any, result?: Mission | Partial<Mission> | any) => any;
  notChangeCar?: boolean;
};

const MissionFormNew: React.FC<Props> = React.memo(
  (props) => {
    const { handleHide } = props;

    // const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const originalFormState = useForm.useFormDataOriginalFormState<Mission>(props.formDataKey);
    const meta = useForm.useFormDataMeta<Mission>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Mission>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const isPermitted = useForm.useFormDataSchemaIsPermitted(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<Mission>(props.formDataKey);
    const canSave = useForm.useFormDataCanSave<Mission>(props.formDataKey);
    const handleSubmitPromise = useForm.useFormDataHandleSubmitPromise<Mission>(props.formDataKey);

    const dispatch = etsUseDispatch();
    const updateFormErrors = React.useCallback(
      () => {
        dispatch(actionUpdateFormErrors(props.formDataKey));
      },
      [],
    );

    return (
      <MissionFormOld
        originalFormState={originalFormState}
        formState={formState}
        isPermitted={isPermitted}
        page={meta.page}
        path={meta.path}
        handleHide={handleHide}
        hideWithoutChanges={props.handleHide}
        formErrors={formErrors}
        updateFormErrors={updateFormErrors}
        handleChange={handleChange}
        canSave={canSave}
        submitAction={handleSubmitPromise}
        notChangeCar={props.notChangeCar}
      />
    );
  },
);

export default MissionFormNew;
