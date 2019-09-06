import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { carActualOptionLabel } from '../waybill_car_id/useWaybillCarActualOptions';

type FieldWaybillTrailerIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillTrailerIdString: React.FC<FieldWaybillTrailerIdStringProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const trailer_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_id']>(props.formDataKey, 'trailer_id');
    const trailer_gov_number = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_gov_number']>(props.formDataKey, 'trailer_gov_number');
    const trailer_model_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_model_name']>(props.formDataKey, 'trailer_model_name');
    const trailer_special_model_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_special_model_name']>(props.formDataKey, 'trailer_special_model_name');
    const trailer_type_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_type_name']>(props.formDataKey, 'trailer_type_name');

    const value = React.useMemo(
      () => {
        if (trailer_id) {
          return carActualOptionLabel(
            trailer_gov_number,
            trailer_model_name,
            trailer_special_model_name,
            trailer_type_name,
          );
        }

        return 'Н/д';
      },
      [
        trailer_id,
        trailer_gov_number,
        trailer_model_name,
        trailer_special_model_name,
        trailer_type_name,
      ],
    );

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
);

export default FieldWaybillTrailerIdString;
