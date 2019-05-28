import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { carActualOptionLabel } from '../waybill_car_id/useWaybillCarActualOptions';

type FieldWaybillTrailerIdStringProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillTrailerIdString: React.FC<FieldWaybillTrailerIdStringProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, key },
    } = props;

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
          <EtsBootstrap.Col md={props.fieldData.md || 12}>
            <ExtField
              id={`${path}_${key}`}
              type="string"
              label={title}
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
