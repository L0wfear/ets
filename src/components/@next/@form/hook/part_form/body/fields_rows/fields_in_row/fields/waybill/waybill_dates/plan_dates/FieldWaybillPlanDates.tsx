import * as React from 'react';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillPlanDatesOwnProps = {
  formDataKey: any;
};

const FieldWaybillPlanDates: React.FC<FieldWaybillPlanDatesOwnProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);

    const plan_departure_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['plan_departure_date']>(props.formDataKey, 'plan_departure_date');
    const plan_arrival_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['plan_arrival_date']>(props.formDataKey, 'plan_arrival_date');

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
);

export default FieldWaybillPlanDates;
