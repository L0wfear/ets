import * as React from 'react';
import { get } from 'lodash';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillCarActualOptions from './useWaybillCarActualOptions';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';

type FieldWaybillCarIdArrayProps = {
  formDataKey: string;
  md: number;
};

const FieldWaybillCarIdArray: React.FC<FieldWaybillCarIdArrayProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const carActualOptionData = useWaybillCarActualOptions(props.formDataKey, formState.car_id, formState.structure_id);
    const selectedCarData = useWaybillFormData.useFormDataGetSelectedCar(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (_, value, option?) => {
        handleChange({
          car_id: value,
          gov_number: get(option, 'rowData.gov_number', null),
        });
      },
      [handleChange],
    );

    const previosStructure = usePrevious(formState.structure_id);

    React.useEffect(
      () => {
        const needTrigger = (
          (previosStructure !== formState.structure_id)
          && selectedCarData
          && formState.structure_id
          && !(
            selectedCarData.is_common
            || (
              selectedCarData.company_structure_id === formState.structure_id
            )
          )
        );

        if (needTrigger) {
          handleChangeWrap('car_id', null);
        }
      },
      [previosStructure, formState.structure_id, selectedCarData, handleChangeWrap],
    );

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            <ExtField
              id={`${path}_car_id`}
              type="select"
              label={`Транспортное средство (поиск по рег. номер  ТС)`}
              value={formState.car_id}
              error={formErrors.car_id}
              options={carActualOptionData.options}
              onChange={handleChangeWrap}
              disabled={!isPermitted}

              etsIsLoading={carActualOptionData.isLoading}
              boundKeys="car_id"
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props,
        formState.car_id,
        formErrors.car_id,
        isPermitted,
        carActualOptionData,
      ],
    );
  },
);

export default FieldWaybillCarIdArray;
