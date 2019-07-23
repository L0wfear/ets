import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';

type FieldWaybillCommonFuelStartProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillCommonFuelStart: React.FC<FieldWaybillCommonFuelStartProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      car_id,
      equipment_fuel,
      is_one_fuel_tank,
      equipment_fuel_start,
      fuel_start,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);
    const isShowField = Boolean(car_id && equipment_fuel === true && is_one_fuel_tank === false);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            {
              isShowField && (
                <ExtField
                  id={`${path}_common_fuel_start`}
                  type="string"
                  label="Общее топливо при выезде, л"
                  value={(equipment_fuel_start + fuel_start).toFixed(3)}
                  disabled
                />
              )
            }
          </EtsBootstrap.Col>
        );
      },
      [
        isShowField,
        path,
        props,
        isPermitted,
        IS_CLOSED,
        equipment_fuel_start,
        fuel_start,
      ],
    );
  },
);

export default FieldWaybillCommonFuelStart;
