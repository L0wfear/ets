import * as React from 'react';

import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionUpdateFormErrors } from 'redux-main/reducers/modules/form_data_record/actions';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import DutyMissionFormOld from 'components/new/pages/missions/duty_mission/form/main/DutyMissionFormOld';
import {  useMissionFormDataHandeChange } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import {
  createMoscowServerDateTime,
  createValidDateTime,
  getTomorrow9amMoscowServerTime
} from 'components/@next/@utils/dates/dates';

type Props = {
  formDataKey: 'duty_mission';
  handleHide: (isSubmitted: any, result?: DutyMission | Partial<DutyMission> | any) => any;
  readOnly?: boolean;
};

const DutyMissionFormNew: React.FC<Props> = React.memo(
  (props) => {
    const { handleHide } = props;

    // const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = useForm.useFormDataMeta<DutyMission>(props.formDataKey);
    const formState = useForm.useFormDataFormState<DutyMission>(props.formDataKey);
    const handleChange = useMissionFormDataHandeChange<DutyMission>(props.formDataKey);
    const isPermitted = useForm.useFormDataSchemaIsPermitted(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<DutyMission>(props.formDataKey);
    const canSave = useForm.useFormDataCanSave<DutyMission>(props.formDataKey);
    const handleSubmitPromise = useForm.useFormDataHandleSubmitPromise<DutyMission>(props.formDataKey);
    const moscowTime = createMoscowServerDateTime(meta.page);

    formState.plan_date_start = formState.id ? formState.plan_date_start : createValidDateTime(moscowTime);
    formState.plan_date_end = formState.id ? formState.plan_date_end : createValidDateTime(getTomorrow9amMoscowServerTime(moscowTime));

    const dispatch = etsUseDispatch();
    const updateFormErrors = React.useCallback(
      () => {
        dispatch(actionUpdateFormErrors(props.formDataKey));
      },
      [],
    );

    const defaultSubmit = React.useCallback(
      async () => {
        try {
          const result = await handleSubmitPromise(formState);
          props.handleHide(true, result);
          return result;
        } catch {
          //
        }
      },
      [formState, props.handleHide, handleSubmitPromise],
    );

    return (
      <DutyMissionFormOld
        readOnly={props.readOnly}
        formState={formState}
        page={meta.page}
        path={meta.path}
        handleHide={handleHide}
        handleChange={handleChange}
        formErrors={formErrors}
        canSave={canSave}
        isPermitted={isPermitted}
        updateFormErrors={updateFormErrors}
        submitAction={handleSubmitPromise}
        defaultSubmit={defaultSubmit}

        formDataKey={props.formDataKey}
      />
    );
  },
);

export default DutyMissionFormNew;
