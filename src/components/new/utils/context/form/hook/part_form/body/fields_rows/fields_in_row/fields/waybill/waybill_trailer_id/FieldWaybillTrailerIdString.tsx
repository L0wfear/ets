import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { carActualOptionLabel } from '../waybill_car_id/useWaybillCarActualOptions';

type FieldWaybillTrailerIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillTrailerIdString: React.FC<FieldWaybillTrailerIdStringProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    const value = React.useMemo(
      () => {
        if (formState.trailer_id) {
          return carActualOptionLabel(
            formState.trailer_gov_number,
            formState.trailer_model_name,
            formState.trailer_special_model_name,
            formState.trailer_type_name,
          );
        }

        return 'Н/д';
      },
      [
        formState.trailer_id,
        formState.trailer_gov_number,
        formState.trailer_model_name,
        formState.trailer_special_model_name,
        formState.trailer_type_name,
      ],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            <ExtField
              id={`${path}_trailer_id`}
              type="string"
              label="Прицеп"
              readOnly
              value={value}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        value,
      ],
    );
  },
);

export default FieldWaybillTrailerIdString;
