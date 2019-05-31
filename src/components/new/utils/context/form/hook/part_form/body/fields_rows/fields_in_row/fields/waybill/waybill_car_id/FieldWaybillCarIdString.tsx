import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { carActualOptionLabel } from './useWaybillCarActualOptions';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillCarIdStringProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillCarIdString: React.FC<FieldWaybillCarIdStringProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, key },
    } = props;

    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
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

export default FieldWaybillCarIdString;
