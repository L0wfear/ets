import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

type FieldWaybillFactDatesOwnProps = {
  formDataKey: string;
};

const FieldWaybillFactDates: React.FC<FieldWaybillFactDatesOwnProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const {
      fact_departure_date,
      fact_arrival_date,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
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

    return React.useMemo(
      () => {
        const isDisabled = (
          !isPermitted
          || IS_CLOSED
        );

        return (
          <Col md={12}>
            <Row>
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
            </Row>
          </Col>
        );
      },
      [
        path,
        fact_departure_date,
        fact_departure_date_error,
        fact_arrival_date_error,
        fact_arrival_date,
        IS_CLOSE_OR_IS_ACTIVE,
        IS_CLOSED,
        handleChangeWrap,
        isPermitted,
      ],
    );
  },
);

export default FieldWaybillFactDates;
