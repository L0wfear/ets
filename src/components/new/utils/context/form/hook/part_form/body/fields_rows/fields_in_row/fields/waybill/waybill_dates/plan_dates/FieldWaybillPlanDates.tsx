import * as React from 'react';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillPlanDatesOwnProps = {
  formDataKey: string;
};

const FieldWaybillPlanDates: React.FC<FieldWaybillPlanDatesOwnProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const {
      plan_departure_date,
      plan_arrival_date,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const {
      plan_departure_date: plan_departure_date_error,
      plan_arrival_date: plan_arrival_date_error,
    } = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);

    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (key: 'plan_departure_date' | 'plan_arrival_date', value: string) => {
        handleChange({
          [key]: value,
        });
      },
      [handleChange],
    );

    return React.useMemo(
      () => {
        const isDisabled = (
          !isPermitted
          || IS_CLOSE_OR_IS_ACTIVE
        );

        return (
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <DatePickerRange
                date_start_id={`${path}_plan_departure_date`}
                date_start_key="plan_departure_date"
                date_start_value={plan_departure_date}
                date_start_error={plan_departure_date_error}
                date_start_time
                date_end_id={`${path}_plan_arrival_date`}
                date_end_key="plan_arrival_date"
                date_end_value={plan_arrival_date}
                date_end_error={plan_arrival_date_error}
                date_end_time
                date_start_label="Выезд план."
                date_end_label="Возвращение план."

                disabled={isDisabled}
                onChange={handleChangeWrap}
              />
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        );
      },
      [
        path,
        plan_departure_date,
        plan_departure_date_error,
        plan_arrival_date_error,
        plan_arrival_date,
        IS_CLOSE_OR_IS_ACTIVE,
        handleChangeWrap,
        isPermitted,
      ],
    );
  },
);

export default FieldWaybillPlanDates;
