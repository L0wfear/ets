import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
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
    const selectedCar = useWaybillFormData.useFormDataFetSelectedCar(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    const value = React.useMemo(
      () => {
        if (selectedCar) {
          return carActualOptionLabel(
            selectedCar.gov_number,
            selectedCar.model_name,
            selectedCar.special_model_name,
            selectedCar.type_name,
          );
        }

        return formState.gov_number;
      },
      [selectedCar, formState.gov_number],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={12}>
            {
              IS_CLOSE_OR_IS_ACTIVE && (
                <ExtField
                  id={`${path}_${key}`}
                  type="string"
                  label={title}
                  readOnly
                  value={value}
                />
              )
            }
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        IS_CLOSE_OR_IS_ACTIVE,
        value,
      ],
    );
  },
);

export default FieldWaybillCarIdString;
