import * as React from 'react';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillFactDatesOwnProps = {
  formDataKey: any;
};

const FieldWaybillFactDates: React.FC<FieldWaybillFactDatesOwnProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);

    const fact_departure_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fact_departure_date']>(props.formDataKey, 'fact_departure_date');
    const fact_arrival_date = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fact_arrival_date']>(props.formDataKey, 'fact_arrival_date');

    const {
      fact_departure_date: fact_departure_date_error,
      fact_arrival_date: fact_arrival_date_error,
    } = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);

    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (key: 'fact_departure_date' | 'fact_arrival_date', value: string) => {
        handleChange({
          [key]: value,
        });
      },
      [handleChange],
    );
    const isDisabled = (
      !isPermitted
      || IS_CLOSED
    );

    return (
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Row>
          {
            IS_CLOSE_OR_IS_ACTIVE
              && (
                <DatePickerRange
                  date_start_id={`${path}_fact_departure_date`}
                  date_start_key="fact_departure_date"
                  date_start_value={fact_departure_date}
                  date_start_error={fact_departure_date_error}
                  date_start_time
                  date_end_id={`${path}_fact_arrival_date`}
                  date_end_key="fact_arrival_date"
                  date_end_value={fact_arrival_date}
                  date_end_error={fact_arrival_date_error}
                  date_end_time
                  date_start_label="Выезд факт."
                  date_end_label="Возвращение факт."

                  disabled={isDisabled}
                  onChange={handleChangeWrap}
                />
              )
          }
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillFactDates;
