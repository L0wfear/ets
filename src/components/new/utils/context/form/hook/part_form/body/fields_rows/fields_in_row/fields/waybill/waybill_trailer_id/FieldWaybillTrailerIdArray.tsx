import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillCarActualOptions from './useWaybillCarActualOptions';
import usePrevious from 'components/new/utils/hooks/usePrevious';

type FieldWaybillTrailerIdArrayProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillTrailerIdArray: React.FC<FieldWaybillTrailerIdArrayProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const carActualOptionData = useWaybillCarActualOptions(props.formDataKey, formState.trailer_id, formState.structure_id);

    const handleChangeWrap = React.useCallback(
      (_, value) => {
        handleChange({
          trailer_id: value,
        });
      },
      [handleChange],
    );

    const previosStructure = usePrevious(formState.structure_id);

    React.useEffect(
      () => {
        if (previosStructure !== formState.structure_id) {
          if (formState.structure_id) {
            handleChangeWrap('trailer_id', null);
          }
        }
      },
      [previosStructure, formState.structure_id, handleChangeWrap],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.fieldData.md || 12}>
            <ExtField
              id={`${path}_${key}`}
              type="select"
              clearable={clearable}
              label={title}
              value={formState.trailer_id}
              error={formErrors.trailer_id}
              options={carActualOptionData.options}
              onChange={handleChangeWrap}
              disabled={!isPermitted}

              etsIsLoading={carActualOptionData.isLoading}
              boundKeys="trailer_id"
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        formState.trailer_id,
        formErrors.trailer_id,
        isPermitted,
        carActualOptionData,
      ],
    );
  },
);

export default FieldWaybillTrailerIdArray;
