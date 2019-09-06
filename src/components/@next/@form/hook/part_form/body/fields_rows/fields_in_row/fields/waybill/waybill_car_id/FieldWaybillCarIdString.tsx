import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { carActualOptionLabel } from './useWaybillCarActualOptions';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillCarIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillCarIdString: React.FC<FieldWaybillCarIdStringProps> = React.memo(
  (props) => {

    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    const value = React.useMemo(
      () => {
        return carActualOptionLabel(
          formState.gov_number,
          formState.car_model_name,
          formState.car_special_model_name,
          formState.car_type_name,
        );
      },
      [
        formState.gov_number,
        formState.car_model_name,
        formState.car_special_model_name,
        formState.car_type_name,
      ],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_car_id`}
          type="string"
          label="Транспортное средство"
          readOnly
          value={value}
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillCarIdString;
